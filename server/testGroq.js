/**
 * server/testGroq.js — Standalone Phase 3 test script
 * Run with: node testGroq.js
 *
 * Tests:
 *  1. groqChat: Greeting turn (no history)
 *  2. groqChat: Follow-up turn with partial fields
 *  3. groqReport: Report for brief call (fallback path)
 *  4. groqReport: Report for substantive conversation
 */

import dotenv from 'dotenv';
dotenv.config();

import { getNextResponse } from './src/services/groqChat.js';
import { generateReport } from './src/services/groqReport.js';

const DIVIDER = '\n' + '─'.repeat(60) + '\n';

async function runTests() {
  console.log('🧪 PulseVoice — Phase 3 Groq Service Tests\n');

  // ─────────────────────────────────────────────────────────────
  // TEST 1: groqChat — initial greeting (empty conversation)
  // ─────────────────────────────────────────────────────────────
  console.log('TEST 1: groqChat — Initial greeting (empty history)');
  try {
    const result1 = await getNextResponse([], {}, 'en');
    console.log('✅ replyText:', result1.replyText);
    console.log('   extractedFields:', JSON.stringify(result1.extractedFields));
  } catch (err) {
    console.error('❌ TEST 1 FAILED:', err.message);
  }

  console.log(DIVIDER);

  // ─────────────────────────────────────────────────────────────
  // TEST 2: groqChat — mid-conversation with partial fields
  // ─────────────────────────────────────────────────────────────
  console.log('TEST 2: groqChat — Mid-conversation turn');
  const mockMessages = [
    { role: 'assistant', content: 'Hello! May I ask your name?' },
    { role: 'user', content: 'Hi, my name is Arjun. I have been having a bad headache.' }
  ];
  const mockFields = { name: 'Arjun', concern: 'headache', duration: null, severity: null, relatedSymptoms: [] };

  try {
    const result2 = await getNextResponse(mockMessages, mockFields, 'en');
    console.log('✅ replyText:', result2.replyText);
    console.log('   extractedFields:', JSON.stringify(result2.extractedFields));
  } catch (err) {
    console.error('❌ TEST 2 FAILED:', err.message);
  }

  console.log(DIVIDER);

  // ─────────────────────────────────────────────────────────────
  // TEST 3: groqReport — brief call fallback (< 2 user turns)
  // ─────────────────────────────────────────────────────────────
  console.log('TEST 3: groqReport — Brief call fallback (1 user turn)');
  const briefMessages = [
    { role: 'assistant', content: 'Hello! May I ask your name?' },
    { role: 'user', content: 'Hi, my name is Priya.' }
  ];

  try {
    const report3 = await generateReport(briefMessages);
    console.log('✅ isSubstantive:', report3.isSubstantive);
    console.log('   summary:', report3.summary);
  } catch (err) {
    console.error('❌ TEST 3 FAILED:', err.message);
  }

  console.log(DIVIDER);

  // ─────────────────────────────────────────────────────────────
  // TEST 4: groqReport — full substantive conversation
  // ─────────────────────────────────────────────────────────────
  console.log('TEST 4: groqReport — Full substantive conversation');
  const fullMessages = [
    { role: 'assistant', content: 'Hello! May I ask your name?' },
    { role: 'user', content: 'My name is Rohan.' },
    { role: 'assistant', content: 'Nice to meet you Rohan. What brings you in today?' },
    { role: 'user', content: 'I have had a severe headache for the past 3 days. It is really painful, around 8 out of 10. I also feel nauseous.' },
    { role: 'assistant', content: 'I am sorry to hear that. Is the headache constant or does it come and go?' },
    { role: 'user', content: 'It is mostly constant, sometimes throbbing.' }
  ];

  try {
    const report4 = await generateReport(fullMessages);
    console.log('✅ Report generated:');
    console.log(JSON.stringify(report4, null, 2));
  } catch (err) {
    console.error('❌ TEST 4 FAILED:', err.message);
  }

  console.log('\n✅ Phase 3 tests complete.\n');
}

runTests();

