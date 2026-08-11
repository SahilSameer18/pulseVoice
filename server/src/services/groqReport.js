import groq from './groqClient.js';
import { buildReportPrompt } from '../prompts/reportPrompt.js';
import { isCallSubstantive } from '../utils/fieldExtractor.js';

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Graceful fallback report for brief/incomplete calls.
 * Returns a valid report schema without calling Groq.
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
      'The call was too brief to collect meaningful intake information. Only limited information was captured during this session.',
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
function buildDefaultReport(rawText) {
  return {
    name: null,
    concern: null,
    symptoms: [],
    duration: null,
    severity: null,
    flags: [],
    summary: rawText.replace(/```json\s*|```/g, '').trim(),
    isSubstantive: true
  };
}

/**
 * Generates a structured health intake report from the full conversation transcript.
 * @param {Array} messages - Full conversation history [{ role, content }]
 * @returns {Object} - Structured report object
 */
export async function generateReport(messages = []) {
  // Skip Groq call for very brief calls — return graceful limited report
  if (!isCallSubstantive(messages)) {
    console.log('[groqReport] Call not substantive — returning fallback report');
    return buildFallbackReport(messages);
  }

  const reportPrompt = buildReportPrompt(messages);

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

  try {
    const parsed = parseLlamaJson(rawText);
    // Fill in any missing fields with safe defaults
    return {
      name: parsed.name || null,
      concern: parsed.concern || null,
      symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
      duration: parsed.duration || null,
      severity: parsed.severity || null,
      flags: Array.isArray(parsed.flags) ? parsed.flags : [],
      summary: parsed.summary || 'No summary available.',
      isSubstantive: parsed.isSubstantive !== false
    };
  } catch {
    console.error('[groqReport] JSON parse failed — using raw text as summary fallback');
    return buildDefaultReport(rawText);
  }
}
