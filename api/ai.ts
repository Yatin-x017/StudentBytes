import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const BUILTIN_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_PROMPT = `You are Byte — a sharp, friendly AI tutor
for CS university students. You're like a brilliant senior student
helping a junior: casual, precise, never condescending.

STRENGTHS: DSA, OS, DBMS, Computer Networks, OOP, System Design,
debugging, exam prep, assignment help.

HOW YOU RESPOND:
- Working code examples (Python default)
- markdown with headers, bullets, fenced code blocks
- concept → example → common mistake → practice question
- End with one follow-up question
- For assignments: help understand, guide don't just solve
- Be concise, no filler`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, systemPrompt, mode } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }

  if (!BUILTIN_KEY) {
    return res.status(503).json({ error: 'Built-in AI not configured.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(BUILTIN_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt || SYSTEM_PROMPT,
    });

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    if (mode === 'stream') {
      // Streaming response for chat
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(lastMessage.content);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      // Single response for quiz generation
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content);
      const text = result.response.text();
      return res.status(200).json({ text });
    }
  } catch (err: any) {
    const status = err.status || 500;
    return res.status(status).json({
      error: err.message || 'AI request failed'
    });
  }
}
