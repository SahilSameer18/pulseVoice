/**
 * Merges AI-extracted intake fields into the session store.
 * Called after each conversation turn.
 */
import { updateFields } from '../store/sessionStore.js';

export function mergeExtractedFields(socketId, extractedFields = {}) {
  if (!extractedFields || typeof extractedFields !== 'object') return;
  updateFields(socketId, extractedFields);
}

/**
 * Returns a list of fields that have not yet been collected.
 * Used to steer the system prompt toward uncollected information.
 */
export function getUnfilledFields(fields = {}) {
  const required = ['name', 'concern', 'duration', 'severity'];
  return required.filter((key) => !fields[key]);
}

/**
 * Determines whether the call had enough substance to generate a meaningful report.
 * Returns false if fewer than 2 real user-AI exchanges happened.
 */
export function isCallSubstantive(messages = []) {
  // Count only actual user turns (not system prompts)
  const userTurns = messages.filter((m) => m.role === 'user').length;
  return userTurns >= 2;
}


