import type { Message } from './types';

/**
 * Stream a chat response from the built-in Groq AI.
 * Properly parses SSE `data: {"delta":"..."}` events.
 */
export async function streamBuiltinAI(
  messages: Message[],
  onChunk: (fullText: string) => void,
  systemPrompt?: string,
  language?: string
): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      ...(systemPrompt ? { system: systemPrompt } : {}),
      language: language || 'Python',
      mode: 'stream',
    }),
  });

  if (!response.ok) {
    let errMsg = `AI request failed (${response.status})`;
    try {
      const errData = await response.json();
      errMsg = errData.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response stream available');

  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') return fullText;

        try {
          const parsed = JSON.parse(data);
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.delta) {
            fullText += parsed.delta;
            onChunk(fullText);
          }
        } catch (parseErr: any) {
          if (parseErr.message && !parseErr.message.includes('JSON')) {
            throw parseErr;
          }
        }
      }
    }
  } finally {
    try { reader.releaseLock(); } catch {}
  }

  return fullText;
}

/**
 * Generate structured content (quiz JSON, analysis) — non-streaming.
 */
export async function generateBuiltinQuiz(
  prompt: string,
  language = 'Python'
): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      language,
      mode: 'generate',
    }),
  });

  if (!response.ok) {
    let errMsg = `Quiz generation failed (${response.status})`;
    try {
      const d = await response.json();
      errMsg = d.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const data = await response.json();
  return data.text || '';
}

/**
 * Analyze a Canvas assignment and provide structured help.
 */
export async function analyzeAssignment(
  name: string,
  description: string,
  course: string,
  language = 'Python'
): Promise<string> {
  const cleanDesc = description
    ? description.replace(/<[^>]*>/g, '').trim().slice(0, 1200)
    : 'No description provided';

  const prompt = `Analyze this university assignment and help the student understand how to approach it.

Course: ${course}
Assignment: ${name}
Description: ${cleanDesc}
Preferred language: ${language}

Provide:
## Summary
2-3 sentences explaining what is required.

## Step-by-Step Plan
Numbered concrete steps to complete this.

## Key Concepts to Study First
Bullet list of prerequisites and concepts.

## Getting Started
A concrete first step or starter code outline in ${language} if applicable.

Be specific and practical. Match depth to a university CS student.`;

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      language,
      mode: 'generate',
    }),
  });

  if (!response.ok) {
    const d = await response.json().catch(() => ({}));
    throw new Error(d.error || 'Assignment analysis failed');
  }

  const data = await response.json();
  return data.text || '';
}
