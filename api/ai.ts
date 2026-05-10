import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const GROQ_KEY = process.env.GROQ_API_KEY || '';
const MODEL = 'llama-3.3-70b-versatile';

const buildSystemPrompt = (language = 'Python') =>
  `You are Byte — a sharp, friendly AI tutor for CS university students.
Casual, precise, never condescending. Like a brilliant senior student helping a junior.

RULES:
- Use ${language} for ALL code examples unless told otherwise
- Always use fenced code blocks tagged with language: \`\`\`${language.toLowerCase()}
- For complex topics: concept → analogy → example → common mistake → practice Q
- Adapt depth to the student's apparent level from their messages
- End every response with ONE focused follow-up question
- Be concise — no filler, no unnecessary repetition

SUBJECTS: DSA, OS, DBMS, Computer Networks, OOP, System Design, Algorithms, Programming`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GROQ_KEY) {
    return res.status(503).json({
      error: 'GROQ_API_KEY not configured. Add it in Vercel → Settings → Environment Variables.'
    });
  }

  const { messages, system, language, mode } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const systemContent = system || buildSystemPrompt(language || 'Python');

  const cleanMessages = messages
    .filter((m: any) => m?.role && m?.content && String(m.content).trim())
    .map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: String(m.content).slice(0, 10000),
    }));

  if (cleanMessages.length === 0) {
    return res.status(400).json({ error: 'No valid messages' });
  }

  const groqMessages = [
    { role: 'system' as const, content: systemContent },
    ...cleanMessages,
  ];

  try {
    const groq = new Groq({ apiKey: GROQ_KEY });

    if (mode === 'generate') {
      // Non-streaming for quiz/structured JSON output
      const response = await groq.chat.completions.create({
        model: MODEL,
        messages: groqMessages,
        max_tokens: 3000,
        temperature: 0.3,
        stream: false,
      });
      const text = response.choices[0]?.message?.content || '';
      return res.status(200).json({ text });
    }

    // SSE streaming for chat
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const stream = await groq.chat.completions.create({
      model: MODEL,
      messages: groqMessages,
      max_tokens: 4096,
      temperature: 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err: any) {
    console.error('[api/ai error]', err.status, err.message);
    if (!res.headersSent) {
      if (err.status === 429) {
        return res.status(429).json({
          error: 'Rate limit reached. Wait a moment and try again.'
        });
      }
      return res.status(500).json({ error: err.message || 'AI request failed' });
    }
    try {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    } catch {}
  }
}
