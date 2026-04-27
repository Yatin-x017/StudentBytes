import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  runtime: 'edge',
};

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

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!BUILTIN_KEY) {
    return new Response(JSON.stringify({ error: 'Built-in AI not configured.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages, systemPrompt, mode } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages array required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const genAI = new GoogleGenerativeAI(BUILTIN_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
      systemInstruction: systemPrompt || SYSTEM_PROMPT,
    });

    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    if (mode === 'stream') {
      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(lastMessage.content);

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          } catch (err: any) {
            controller.error(err);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content);
      const text = result.response.text();
      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'AI request failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
