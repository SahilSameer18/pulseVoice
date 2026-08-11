import { wrapSocketHandler } from '../middlewares/errorHandler.js';
import { createSession, getSession, addMessage, deleteSession } from '../store/sessionStore.js';
import { mergeExtractedFields } from '../utils/fieldExtractor.js';
import { validateAudioBuffer } from '../utils/audioHelper.js';
import { getNextResponse } from '../services/groqChat.js';
import { transcribeAudio } from '../services/groqStt.js';
import { generateReport } from '../services/groqReport.js';

export function registerCallHandlers(io, socket) {
  // ─────────────────────────────────────────────
  // call:start — create session, generate AI greeting
  // ─────────────────────────────────────────────
  socket.on(
    'call:start',
    wrapSocketHandler(socket, async (data = {}) => {
      const language = data.language || 'auto';
      console.log(`[${socket.id}] call:start — language: ${language}`);

      const session = createSession(socket.id, language);

      // Generate AI greeting (no user message yet)
      const { replyText, extractedFields } = await getNextResponse(
        session.messages,
        session.fields,
        language
      );

      // Push AI greeting into transcript
      addMessage(socket.id, 'assistant', replyText);
      mergeExtractedFields(socket.id, extractedFields);

      socket.emit('call:greeting', {
        success: true,
        message: 'Call started',
        data: { text: replyText, language }
      });
    })
  );

  // ─────────────────────────────────────────────
  // turn:audio — STT → LLM → respond
  // ─────────────────────────────────────────────
  socket.on(
    'turn:audio',
    wrapSocketHandler(socket, async (payload) => {
      const session = getSession(socket.id);
      if (!session) {
        socket.emit('turn:error', {
          success: false,
          message: 'No active call session found. Please start a new call.',
          errors: ['session_not_found']
        });
        return;
      }

      // payload = { buffer: ArrayBuffer/Buffer, mimeType: string }
      const buffer = payload?.buffer || payload;
      const mimeType = payload?.mimeType || 'audio/webm';

      console.log(`[${socket.id}] turn:audio — size: ${buffer?.byteLength || buffer?.length || 0} bytes, mime: ${mimeType}`);

      // Step 1: Validate buffer — reject silence / empty audio
      const audioCheck = validateAudioBuffer(buffer);
      if (!audioCheck.valid) {
        console.warn(`[${socket.id}] Audio rejected: ${audioCheck.reason}`);
        socket.emit('turn:error', {
          success: false,
          message: audioCheck.message,
          errors: [audioCheck.reason]
        });
        return;
      }

      // Step 2: Speech-to-Text via Groq Whisper with session language bias
      const { text: userText, isEmpty } = await transcribeAudio(buffer, mimeType, session.language);

      if (isEmpty) {
        console.warn(`[${socket.id}] STT returned empty transcript`);
        socket.emit('turn:error', {
          success: false,
          message: "Didn't catch that — please speak clearly and try again.",
          errors: ['empty_transcript']
        });
        return;
      }

      console.log(`[${socket.id}] STT result: "${userText}"`);

      // Step 3: Add user message to transcript
      addMessage(socket.id, 'user', userText);

      // Step 4: Get AI response from Groq Llama
      const { replyText, extractedFields } = await getNextResponse(
        session.messages,
        session.fields,
        session.language
      );

      console.log(`[${socket.id}] AI reply: "${replyText}"`);

      // Step 5: Update session with AI message and extracted fields
      addMessage(socket.id, 'assistant', replyText);
      mergeExtractedFields(socket.id, extractedFields);

      // Step 6: Emit response to client
      socket.emit('turn:response', {
        success: true,
        message: 'Turn processed',
        data: {
          userText,
          text: replyText,
          extractedFields
        }
      });
    })
  );

  // ─────────────────────────────────────────────
  // call:end — generate report, clean up session
  // ─────────────────────────────────────────────
  socket.on(
    'call:end',
    wrapSocketHandler(socket, async () => {
      const session = getSession(socket.id);
      console.log(`[${socket.id}] call:end — generating report`);

      const messages = session?.messages || [];

      const report = await generateReport(messages);

      // Clean up session
      deleteSession(socket.id);

      socket.emit('call:report', {
        success: true,
        message: 'Report generated',
        data: { report }
      });
    })
  );

  // ─────────────────────────────────────────────
  // disconnect — ensure session cleanup on tab close / refresh
  // ─────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[${socket.id}] Client disconnected — cleaning up session`);
    deleteSession(socket.id);
  });
}


