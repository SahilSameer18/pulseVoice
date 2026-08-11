import { toFile } from 'groq-sdk';
import groq from './groqClient.js';

/**
 * Transcribes an audio buffer using Groq Whisper.
 * @param {Buffer} buffer - Raw audio binary from MediaRecorder
 * @param {string} mimeType - Runtime MIME type from mediaRecorder.mimeType (e.g. 'audio/webm;codecs=opus')
 * @returns {{ text: string, isEmpty: boolean }}
 */
export async function transcribeAudio(buffer, mimeType = 'audio/webm') {
  // Sanitize MIME type: strip codecs part, pick correct file extension
  const cleanMime = mimeType.split(';')[0].trim() || 'audio/webm';
  const isOgg = cleanMime.includes('ogg');
  const filename = isOgg ? 'speech.ogg' : 'speech.webm';

  const file = await toFile(buffer, filename, { type: cleanMime });

  const transcription = await groq.audio.transcriptions.create({
    file,
    model: 'whisper-large-v3-turbo',
    response_format: 'json'
  });

  const text = transcription.text?.trim() || '';
  const isEmpty = text.length < 3;

  return { text, isEmpty };
}



