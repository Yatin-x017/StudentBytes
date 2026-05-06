import Groq from 'groq-sdk';

export const config = {
  runtime: 'edge',
};

import { createClient } from '@supabase/supabase-js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Models tried in order — if one is rate-limited, the next is used
const FALLBACK_MODELS = [
  'llama-3.3-70b-versatile',   // Best quality
  'llama-3.1-8b-instant',      // Fast, high rate limits
  'gemma2-9b-it',              // Google model, separate quota
];

function friendlyError(err: any): { message: string; status: number } {
  const status = err?.status ?? err?.error?.status ?? 500;
  const raw = err?.message ?? err?.error?.message ?? '';

  if (status === 429) {
    // Try to extract retry time from the Groq message
    const retryMatch = raw.match(/try again in ([^.]+)/i);
    const retryIn = retryMatch ? ` Try again in ${retryMatch[1]}.` : '';
    return {
      message: `The built-in AI has hit its daily usage limit.${retryIn} Add your own API key in Settings for unlimited access.`,
      status: 429,
    };
  }
  if (status === 401) return { message: 'Invalid API key. Check your Groq key.', status: 401 };
  if (status === 503) return { message: 'AI service is temporarily unavailable. Try again shortly.', status: 503 };
  return { message: raw || 'AI provider error. Please try again.', status };
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  }

  if (!process.env.GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Built-in AI is not configured. Please add your own API key in Settings.' }),
      { status: 503, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }

  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error. Please try again later.' }),
      { status: 503, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authentication required. Please log in.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid or expired session. Please log in again.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const { messages, system } = await req.json();
  const formattedMessages = [
    ...(system ? [{ role: 'system' as const, content: system }] : []),
    ...messages,
  ];

  let lastErr: any = null;

  for (const model of FALLBACK_MODELS) {
    try {
      const response = await groq.chat.completions.create({
        model,
        messages: formattedMessages,
        stream: true,
      });

      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(new TextEncoder().encode(content));
          }
          controller.close();
        },
      });

      return new Response(stream, { headers: CORS_HEADERS });
    } catch (err: any) {
      const status = err?.status ?? err?.error?.status;
      console.warn(`[ai] Model ${model} failed (${status}):`, err?.message);
      lastErr = err;

      // Only fall through to next model on rate-limit (429) or overload (503)
      if (status !== 429 && status !== 503) break;
    }
  }

  // All models exhausted — return a friendly error
  const { message, status } = friendlyError(lastErr);
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}
