import groq from './groqClient.js';
import { buildReportPrompt } from '../prompts/reportPrompt.js';
import { isCallSubstantive } from '../utils/fieldExtractor.js';

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Graceful fallback report for zero-turn calls (where no user audio was captured).
 */
function buildFallbackReport(messages) {
  return {
    name: null,
    concern: null,
    symptoms: [],
    duration: null,
    severity: null,
    flags: [],
    summary:
      'The call ended before any patient information was spoken. No intake data was captured during this session.',
    isSubstantive: false
  };
}

/**
 * Safely parse JSON from Llama output.
 */
function parseLlamaJson(rawText) {
  const cleaned = rawText.replace(/```json\s*|```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Schema-safe default report for when JSON parse fails.
 */
function buildDefaultReport(rawText, isSubstantive = true) {
  return {
    name: null,
    concern: null,
    symptoms: [],
    duration: null,
    severity: null,
    flags: [],
    summary: rawText.replace(/```json\s*|```/g, '').trim(),
    isSubstantive
  };
}

/**
 * Generates a structured health intake report from the full conversation transcript.
 * Preserves collected data even if the call was brief.
 * @param {Array} messages - Full conversation history [{ role, content }]
 * @returns {Object} - Structured report object
 */
export async function generateReport(messages = []) {
  const userMessages = messages.filter((m) => m.role === 'user' || m.sender === 'user');

  // If no user turns occurred at all, return empty fallback report without calling API
  if (userMessages.length === 0) {
    console.log('[groqReport] 0 user messages — returning empty fallback report');
    return buildFallbackReport(messages);
  }

  const substantiveCall = isCallSubstantive(messages);
  const reportPrompt = buildReportPrompt(messages);

  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a medical scribe. Always respond with only valid JSON.' },
        { role: 'user', content: reportPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 1024
    });

    const rawText = response.choices[0]?.message?.content || '';
    const parsed = parseLlamaJson(rawText);

    return {
      name: parsed.name || null,
      concern: parsed.concern || null,
      symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
      duration: parsed.duration || null,
      severity: parsed.severity || null,
      flags: Array.isArray(parsed.flags) ? parsed.flags : [],
      summary: parsed.summary || (substantiveCall ? 'No summary available.' : 'Brief call intake captured.'),
      isSubstantive: substantiveCall && parsed.isSubstantive !== false
    };
  } catch (err) {
    console.error('[groqReport] Failed to generate LLM report:', err?.message || err);
    return buildDefaultReport('Intake information was partially collected during this session.', substantiveCall);
  }
}
