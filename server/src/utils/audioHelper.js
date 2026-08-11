/**
 * Audio buffer validation helpers.
 * Checks incoming binary audio buffers before sending to Groq Whisper.
 */

// Minimum buffer size in bytes to be considered non-silent (roughly ~200ms of audio)
const SILENCE_THRESHOLD_BYTES = 3000;

/**
 * Validates an incoming audio buffer.
 * Returns { valid: bool, reason: string }
 */
export function validateAudioBuffer(buffer) {
  if (!buffer) {
    return { valid: false, reason: 'no_audio', message: 'No audio data received.' };
  }

  const size = buffer.byteLength || buffer.length || 0;

  if (size === 0) {
    return { valid: false, reason: 'empty_buffer', message: 'Audio buffer is empty.' };
  }

  if (size < SILENCE_THRESHOLD_BYTES) {
    return {
      valid: false,
      reason: 'silence',
      message: 'Audio too short — likely silence or noise. Please speak clearly and try again.'
    };
  }

  return { valid: true, reason: null, message: null };
}
