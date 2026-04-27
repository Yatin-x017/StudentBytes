import type { Message } from './types';

export async function streamBuiltinAI(
  messages: Message[],
  onChunk: (text: string) => void,
  systemPrompt?: string
): Promise<void> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      systemPrompt,
      mode: 'stream',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `AI request failed: ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) throw new Error('No response stream');

  let fullText = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') break;
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            fullText += parsed.text;
            onChunk(fullText);
          }
        } catch {
          // ignore malformed chunks
        }
      }
    }
  }
}

export async function generateBuiltinQuiz(
  _topic: string,
  _difficulty: string,
  quizPrompt: string
): Promise<string> {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: quizPrompt }],
      mode: 'generate',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Failed' }));
    throw new Error(err.error || 'Quiz generation failed');
  }

  const data = await response.json();
  return data.text || '';
}

export async function analyzeAssignment(
  assignmentName: string,
  description: string,
  courseName: string,
  systemPrompt?: string
): Promise<string> {
  const prompt = `I have an assignment from my university Canvas LMS.

Course: ${courseName}
Assignment: ${assignmentName}
Description: ${description || 'No description provided'}

Please:
1. Summarize what this assignment requires in 2-3 sentences
2. Break it down into clear actionable steps
3. Suggest key concepts I should study to complete it
4. Give me a starting point or outline

Be specific and practical.`;

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      systemPrompt,
      mode: 'generate',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Failed' }));
    throw new Error(err.error || 'Analysis failed');
  }

  const data = await response.json();
  return data.text || '';
}
