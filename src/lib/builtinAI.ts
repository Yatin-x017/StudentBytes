import type { Message, Profile } from './types';
import { getPersonalizedSystemPrompt, getSubjectEnhancement } from './aiPersonalization';

export async function streamBuiltinAI(
  messages: Message[],
  onChunk: (fullText: string) => void,
  systemPrompt?: string,
  language?: string,
  profile?: Profile | null
): Promise<string> {
  // Use personalized system prompt if profile is provided and no custom prompt is given
  const finalSystemPrompt = systemPrompt || (profile ? getPersonalizedSystemPrompt(profile) : undefined);

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      system: finalSystemPrompt,
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
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') return fullText;
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.delta) {
            fullText += parsed.delta;
            onChunk(fullText);
          }
        } catch (e: any) {
          if (e.message && !e.message.includes('JSON')) throw e;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullText;
}

export async function generateBuiltinQuiz(
  prompt: string,
  language?: string,
  profile?: Profile | null
): Promise<string> {
  // Enhance prompt with profile-specific context
  const enhancedPrompt = profile
    ? `${prompt}\n\nContext: Student from ${profile.college} studying ${profile.branch} (Year ${profile.year})`
    : prompt;

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: enhancedPrompt }],
      language: language || 'Python',
      mode: 'generate',
    }),
  });

  if (!response.ok) {
    let errMsg = `Quiz generation failed (${response.status})`;
    try {
      const errData = await response.json();
      errMsg = errData.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const data = await response.json();
  return data.text || '';
}

export async function analyzeAssignment(
  name: string,
  description: string,
  course: string,
  language = 'Python',
  profile?: Profile | null
): Promise<string> {
  const subjectEnhancement = profile ? getSubjectEnhancement(course, profile) : '';

  const prompt = `Analyze this university assignment and help the student understand it.

Course: ${course}
Assignment: ${name}
Description: ${description?.replace(/<[^>]*>/g, '').trim().slice(0, 1200) || 'Not provided'}

Provide a structured breakdown:

## What This Assignment Requires
(2-3 sentences summarizing the core task)

## Step-by-Step Plan
(Numbered concrete steps to complete this)

## Key Concepts to Study First
(Bullet list of prerequisites)

## Getting Started
(Concrete first step + starter code outline in ${language} if applicable)

${subjectEnhancement}

Be specific. Calibrate depth to a university CS student.`;

  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      language,
      mode: 'generate',
    }),
  });

  if (!response.ok) throw new Error('Assignment analysis failed');
  const data = await response.json();
  return data.text || '';
}
