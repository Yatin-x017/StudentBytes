import type { Message } from './types';

import { supabase } from './supabase';

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

  const session = await supabase?.auth.getSession();
  const token = session?.data.session?.access_token;

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let errorMsg = `Built-in AI failed (HTTP ${response.status})`;
    try {
      const errData = await response.json();
      errorMsg = errData.error || errorMsg;
    } catch {
      // keep default message
    }
    throw new Error(errorMsg);
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
  const session = await supabase?.auth.getSession();
  const token = session?.data.session?.access_token;

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    let errorMsg = `Built-in AI failed to generate quiz (HTTP ${response.status})`;
    try {
      const errData = await response.json();
      errorMsg = errData.error || errorMsg;
    } catch {
      // keep default message
    }
    throw new Error(errorMsg);
  }

  return response.text();
}
