import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, QUIZ_PROMPT } from './anthropic';
import type { Message, QuizQuestion } from './types';

export const getGeminiClient = (apiKey: string) =>
  new GoogleGenerativeAI(apiKey);

export async function streamGeminiMessage(
  apiKey: string,
  messages: Message[],
  onChunk: (text: string) => void
): Promise<string> {
  const genAI = getGeminiClient(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage.content);

  let fullText = '';
  for await (const chunk of result.stream) {
    const text = chunk.text();
    fullText += text;
    onChunk(fullText);
  }
  return fullText;
}

export async function generateGeminiQuiz(
  apiKey: string,
  topic: string,
  difficulty: string
): Promise<QuizQuestion[]> {
  const genAI = getGeminiClient(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await model.generateContent(QUIZ_PROMPT(topic, difficulty));
  const text = result.response.text();

  const cleaned = text.replace(/```json\n?/, '').replace(/\n?```/, '').trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('Quiz generation failed — try a different topic.');
  return JSON.parse(match[0]) as QuizQuestion[];
}
