import { toFile } from 'groq-sdk';
import groq from './groqClient.js';

/**
 * Transcribes an audio buffer using Groq Whisper.
 * Provides targeted vocabulary prompts for Hindi and English recognition.
 * @param {Buffer} buffer - Raw audio binary from MediaRecorder
 * @param {string} mimeType - Runtime MIME type from mediaRecorder.mimeType
 * @param {string} language - 'en' | 'hi' | 'auto'
 * @returns {{ text: string, isEmpty: boolean }}
 */
export async function transcribeAudio(buffer, mimeType = 'audio/webm', language = 'auto') {
  // Sanitize MIME type: strip codecs part, pick correct file extension
  const cleanMime = mimeType.split(';')[0].trim() || 'audio/webm';
  const isOgg = cleanMime.includes('ogg');
  const filename = isOgg ? 'speech.ogg' : 'speech.webm';

  const file = await toFile(buffer, filename, { type: cleanMime });

  const params = {
    file,
    model: 'whisper-large-v3-turbo',
    response_format: 'json'
  };

  if (language === 'hi') {
    params.language = 'hi';
    params.prompt = 'नमस्ते, मरीज हिंदी में स्वास्थ्य समस्या बता रहा है। सिरदर्द, बुखार, दर्द, बीमारी, नाम, दिन।';
  } else if (language === 'en') {
    params.language = 'en';
    params.prompt = 'Patient describing medical health symptoms during intake call.';
  } else {
    params.prompt = 'Health intake call. मरीज हिंदी या अंग्रेजी में बात कर रहा है।';
  }

  const transcription = await groq.audio.transcriptions.create(params);

  const text = transcription.text?.trim() || '';
  const isEmpty = text.length < 3;

  return { text, isEmpty };
}
