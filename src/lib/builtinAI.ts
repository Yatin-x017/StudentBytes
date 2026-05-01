import type { Message } from './types';

export async function streamBuiltinAI(
  messages: Message[],
  onChunk: (text: string) => void,
  systemPrompt?: string
) {
  const body: any = {
    messages: messages.map(m => ({ role: m.role, content: m.content }))
  };

  if (systemPrompt) {
    body.system = systemPrompt;
  }

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error('Built-in AI failed to respond');
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    fullText += chunk;
    onChunk(fullText);
  }
}

export async function generateBuiltinQuiz(prompt: string) {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error('Built-in AI failed to generate quiz');
  }

  return response.text();
}
