/**
 * Builds the report generation prompt.
 * Takes the full conversation transcript and returns structured JSON.
 */
export function buildReportPrompt(messages = []) {
  const transcript = messages
    .map((m) => `${m.role === 'user' ? 'Patient' : 'AI'}: ${m.content}`)
    .join('\n');

  return `You are a medical scribe. Based on the following health intake call transcript, extract and summarize the patient's information into a structured clinical intake note.

## Transcript:
${transcript}

## Instructions:
- Summarize only what was actually said — do not invent or assume any information not mentioned.
- If a field was not discussed or the patient did not answer, use null or an empty array.
- For the "summary", write 2-4 sentences as if briefing a doctor before they see the patient. Use clear, direct language.
- For "flags", only include items the patient mentioned that might warrant clinical follow-up (e.g., sudden severe onset, chest pain, difficulty breathing). If nothing flagged, return an empty array.
- Set "isSubstantive" to false if the call was very brief (fewer than 2 real patient responses).
- Do NOT give diagnoses, recommendations, or medical opinions.

## CRITICAL: You MUST respond with ONLY valid JSON matching this exact schema:
{
  "name": "patient name or null",
  "concern": "main health complaint or null",
  "symptoms": ["symptom 1", "symptom 2"],
  "duration": "how long the issue has been occurring or null",
  "severity": "mild/moderate/severe or patient's own description or null",
  "flags": ["item worth mentioning to physician or empty array"],
  "summary": "2-4 sentence narrative summary for the doctor",
  "isSubstantive": true
}`;
}



