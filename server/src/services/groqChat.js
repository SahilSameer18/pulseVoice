import groq from './groqClient.js';
import { buildSystemPrompt } from '../prompts/systemPrompt.js';

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Safely parse JSON from Llama output.
 * Strips markdown code fences if present, then JSON.parse.
 * Falls back gracefully if parsing fails.
 */
function parseLlamaJson(rawText) {
  const cleaned = rawText.replace(/```json\s*|```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Generates the next AI response in the intake conversation.
 * Returns { replyText, extractedFields }
 *
 * @param {Array} messages - Full conversation history [{ role, content }]
 * @param {Object} fields - Current collected intake fields
 * @param {string} language - 'en' | 'hi' | 'auto'
 */
export async function getNextResponse(messages = [], fields = {}, language = 'auto') {
  const systemPrompt = buildSystemPrompt(fields, language);

  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: chatMessages,
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 512
  });

  const rawText = response.choices[0]?.message?.content || '';

  try {
    const parsed = parseLlamaJson(rawText);
    return {
      replyText: parsed.replyText || rawText,
      extractedFields: parsed.extractedFields || {}
    };
  } catch {
    // JSON parse failed — use raw text as the spoken reply, no field extraction this turn
    console.warn('[groqChat] JSON parse failed, using raw text as replyText fallback');
    return {
      replyText: rawText.replace(/```json\s*|```|\{|\}/g, '').trim(),
      extractedFields: {}
    };
  }
}

