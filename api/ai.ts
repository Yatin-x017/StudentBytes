import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

const SYSTEM_PROMPT = `You are Byte — a sharp, friendly AI tutor
for CS university students. Casual, precise, never condescending.
Cover DSA, OS, DBMS, Networks, OOP, System Design.
Use markdown, code examples, end with a follow-up question.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, systemPrompt, mode } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages required' });
  if (!ANTHROPIC_KEY) return res.status(503).json({ error: 'Built-in AI not configured.' });

  try {
    const client = new Anthropic({ apiKey: ANTHROPIC_KEY });

    const anthropicMessages = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

    if (mode === 'stream') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await client.messages.stream({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        system: systemPrompt || SYSTEM_PROMPT,
        messages: anthropicMessages,
      });

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        system: systemPrompt || SYSTEM_PROMPT,
        messages: anthropicMessages,
      });
      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      return res.status(200).json({ text });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI request failed' });
  }
}
