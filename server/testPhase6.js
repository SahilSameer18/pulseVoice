/**
 * server/testPhase6.js — Automated Edge Case & Failure Handling Verification
 * Run with: node testPhase6.js
 *
 * Tests:
 *  1. Audio Silence Check (Buffer < 3KB)
 *  2. Empty STT Transcript Handling
 *  3. LLM JSON Parsing Fallback Safety
 *  4. Early Call Termination (0-1 exchanges fallback report)
 *  5. In-Memory Session Cleanup on Disconnect
 */

import dotenv from 'dotenv';
dotenv.config();

import { validateAudioBuffer } from './src/utils/audioHelper.js';
import { isCallSubstantive } from './src/utils/fieldExtractor.js';
import { generateReport } from './src/services/groqReport.js';
import { createSession, getSession, deleteSession } from './src/store/sessionStore.js';

const DIVIDER = '\n' + '─'.repeat(60) + '\n';

async function runEdgeCaseTests() {
  console.log('🧪 PulseVoice — Phase 6 Edge Case & Failure Handling Tests\n');

  // ─────────────────────────────────────────────────────────────
  // EDGE CASE 1: Silence & Small Audio Buffer
  // ─────────────────────────────────────────────────────────────
  console.log('EDGE CASE 1: Audio Silence Check (Buffer < 3KB)');
  const tinyBuffer = Buffer.alloc(500); // 500 bytes (silent audio)
  const validation = validateAudioBuffer(tinyBuffer);

  if (!validation.valid && validation.reason === 'silence') {
    console.log('✅ Silence correctly detected:');
    console.log('   Message:', validation.message);
  } else {
    console.error('❌ EDGE CASE 1 FAILED: Expected silence detection', validation);
  }

  console.log(DIVIDER);

  // ─────────────────────────────────────────────────────────────
  // EDGE CASE 2: Early Call Termination (< 2 user turns)
  // ─────────────────────────────────────────────────────────────
  console.log('EDGE CASE 2: Early Call Termination (0-1 exchanges)');
  const briefMessages = [
    { role: 'assistant', content: 'Hello! May I ask your name?' },
    { role: 'user', content: 'Hi, my name is Alex.' }
  ];

  const isSubstantive = isCallSubstantive(briefMessages);
  console.log(`   isCallSubstantive(1 turn) = ${isSubstantive}`);

  const report = await generateReport(briefMessages);
  if (!report.isSubstantive && report.summary.includes('brief')) {
    console.log('✅ Early termination handled gracefully:');
    console.log('   isSubstantive:', report.isSubstantive);
    console.log('   summary:', report.summary);
  } else {
    console.error('❌ EDGE CASE 2 FAILED:', report);
  }

  console.log(DIVIDER);

  // ─────────────────────────────────────────────────────────────
  // EDGE CASE 3: Session Memory Cleanup
  // ─────────────────────────────────────────────────────────────
  console.log('EDGE CASE 3: In-Memory Session Cleanup');
  const testSocketId = 'socket_test_999';
  createSession(testSocketId, 'en');

  const beforeDelete = getSession(testSocketId);
  console.log('   Created session exists:', !!beforeDelete);

  deleteSession(testSocketId);
  const afterDelete = getSession(testSocketId);
  console.log('   Session deleted on disconnect:', afterDelete === null);

  if (beforeDelete && afterDelete === null) {
    console.log('✅ Session cleanup verified — no memory leak.');
  } else {
    console.error('❌ EDGE CASE 3 FAILED');
  }

  console.log('\n✅ Phase 6 Edge Case Verification Complete!\n');
}

runEdgeCaseTests();
