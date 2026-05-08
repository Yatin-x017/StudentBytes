import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const GROQ_KEY = process.env.GROQ_API_KEY || '';

const SYSTEM_PROMPT = (language = 'Python') =>
  `You are Byte — a sharp, friendly AI tutor for CS university students.
Casual, precise, never condescending. Like a brilliant senior helping a junior.

TEACHING STYLE:
- Use ${language} for ALL code examples unless the student specifies otherwise
- Use markdown with fenced code blocks tagged with the language (e.g. \`\`\`${language.toLowerCase()}\`)
- For complex topics: concept → analogy → example → common mistake → practice question
- Adapt explanation depth to the student's apparent level from their messages
- End every response with ONE follow-up question

SUBJECTS: DSA, OS, DBMS, Computer Networks, OOP, System Design, Algorithms

IMPORTANT: Keep responses focused. No filler. No unnecessary repetition.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GROQ_KEY) {
    return res.status(503).json({
      error: 'GROQ_API_KEY not set in Vercel environment variables. Add it at vercel.com/dashboard.'
    });
  }

  let body: any;
  try {
    body = req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { messages, system, language, mode } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required and must not be empty' });
  }

  // Build system prompt
  const systemContent = system || SYSTEM_PROMPT(language || 'Python');

  // Validate and clean messages
  const cleanMessages = messages
    .filter((m: any) => m && m.role && m.content && String(m.content).trim())
    .map((m: any) => ({
      role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: String(m.content).slice(0, 8000), // prevent token overflow
    }));

  if (cleanMessages.length === 0) {
    return res.status(400).json({ error: 'No valid messages found' });
  }

  const groqMessages = [
    { role: 'system' as const, content: systemContent },
    ...cleanMessages,
  ];

  try {
    const groq = new Groq({ apiKey: GROQ_KEY });

    if (mode === 'generate') {
      // Non-streaming for quiz/structured output
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        max_tokens: 3000,
        temperature: 0.4,
        stream: false,
      });
      const text = response.choices[0]?.message?.content || '';
      return res.status(200).json({ text });
    }

    // Streaming (default)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    if (res.flushHeaders) res.flushHeaders();

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
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
    console.error('[api/ai]', err.status, err.message);
    if (!res.headersSent) {
      if (err.status === 429) {
        return res.status(429).json({ error: 'Rate limit hit. Please wait a moment and try again.' });
      }
      return res.status(500).json({ error: err.message || 'AI request failed' });
    }
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
}
