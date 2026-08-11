/**
 * In-memory session store for active voice calls.
 * Keyed by socket.id — production would use Redis or a DB.
 */

const sessions = new Map();

/**
 * Create a new call session for a connected socket
 */
export function createSession(socketId, language = 'auto') {
  const session = {
    messages: [],       // Full transcript: [{ role: 'user'|'assistant', content: string }]
    fields: {
      name: null,
      concern: null,
      duration: null,
      severity: null,
      relatedSymptoms: []
    },
    language,
    startedAt: Date.now()
  };
  sessions.set(socketId, session);
  return session;
}

/**
 * Get an existing session by socketId
 */
export function getSession(socketId) {
  return sessions.get(socketId) || null;
}

/**
 * Add a message to the session transcript
 */
export function addMessage(socketId, role, content) {
  const session = sessions.get(socketId);
  if (!session) return;
  session.messages.push({ role, content });
}

/**
 * Update extracted fields from the AI response
 */
export function updateFields(socketId, extractedFields = {}) {
  const session = sessions.get(socketId);
  if (!session) return;
  for (const [key, value] of Object.entries(extractedFields)) {
    if (key === 'relatedSymptoms' && Array.isArray(value)) {
      // Merge arrays, avoid duplicates
      const existing = session.fields.relatedSymptoms || [];
      session.fields.relatedSymptoms = [...new Set([...existing, ...value])];
    } else if (value !== null && value !== undefined && value !== '') {
      session.fields[key] = value;
    }
  }
}

/**
 * Delete session on disconnect or call end
 */
export function deleteSession(socketId) {
  sessions.delete(socketId);
}

export default { createSession, getSession, addMessage, updateFields, deleteSession };



