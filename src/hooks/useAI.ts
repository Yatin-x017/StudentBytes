import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getAnthropicClient, buildSystemPromptWithFile, SYSTEM_PROMPT, QUIZ_PROMPT } from '@/lib/anthropic';
import { streamGeminiMessage, generateGeminiQuiz } from '@/lib/gemini';
import { truncateForContext } from '@/lib/pdfExtractor';
import type { Message, QuizQuestion } from '@/lib/types';
import { streamBuiltinAI, generateBuiltinQuiz } from '@/lib/builtinAI';
import { useAuth } from '@/context/AuthContext';

export function useAI() {
  const { state, dispatch } = useAppContext();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to always have the latest state in the async streamMessage
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const streamMessage = useCallback(
    async (
      sessionId: string,
      userContent: string,
      onChunk?: (text: string) => void,
      initialSession?: any // Handle new session race condition
    ) => {
      setLoading(true);
      setError(null);

      const currentState = stateRef.current;
      const session = initialSession || currentState.sessions.find(s => s.id === sessionId);
      if (!session) {
        console.error('[useAI] Session not found:', sessionId);
        setLoading(false);
        return;
      }

      const language = currentState.settings.defaultLanguage || 'Python';
      const hasAnthropicKey = !!currentState.apiKey;
      const hasGeminiKey = !!(currentState.settings as any)?.geminiApiKey;

      const assistantMsgId = `msg_${Date.now() + 1}`;
      const newUserMsg: Message = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: userContent,
        timestamp: Date.now(),
      };
      const messagesWithUser = [...session.messages, newUserMsg];

      // Dispatch user message immediately
      dispatch({
        type: 'UPDATE_SESSION',
        payload: { ...session, messages: messagesWithUser, updatedAt: Date.now() },
      });

      const updateAssistant = (text: string) => {
        dispatch({
          type: 'UPDATE_SESSION',
          payload: {
            ...session,
            updatedAt: Date.now(),
            messages: [
              ...messagesWithUser,
              { id: assistantMsgId, role: 'assistant' as const, content: text, timestamp: Date.now() },
            ],
          },
        });
        onChunk?.(text);
      };

      const showError = (msg: string) => {
        let content = `⚠️ **Error:** ${msg}\n\nPlease try again.`;

        if (msg.includes('401') || msg.toLowerCase().includes('invalid api key')) {
          content = `⚠️ **Built-in AI key expired.**
The server's Groq API key needs to be renewed by the admin.

**Quick fix:** Add your own free key in Settings:
1. Get a free key at [console.groq.com](https://console.groq.com)
2. Go to **Settings** → choose your provider
3. Paste your key

This takes 2 minutes and gives you unlimited usage.`;
        }

        dispatch({
          type: 'UPDATE_SESSION',
          payload: {
            ...session,
            messages: [
              ...messagesWithUser,
              {
                id: assistantMsgId,
                role: 'assistant' as const,
                content,
                timestamp: Date.now(),
              },
            ],
          },
        });
        setError(msg);
      };

      try {
        const systemPrompt = session.attachedFile
          ? buildSystemPromptWithFile(
              truncateForContext(session.attachedFile.text),
              session.attachedFile.name
            )
          : undefined; // api/ai.ts builds the default prompt with language

        // Priority: Anthropic key → Gemini key → Built-in Groq (default)
        if (currentState.settings?.provider === 'anthropic' && hasAnthropicKey) {
          // User's Anthropic key
          const client = getAnthropicClient(currentState.apiKey);
          const stream = await client.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 4096,
            temperature: 0.7,
            system: systemPrompt || SYSTEM_PROMPT,
            messages: messagesWithUser.map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
            stream: true,
          });
          let fullText = '';
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              fullText += event.delta.text;
              updateAssistant(fullText);
            }
          }
        } else if (currentState.settings?.provider === 'gemini' && hasGeminiKey) {
          // User's Gemini key
          await streamGeminiMessage(
            (currentState.settings as any).geminiApiKey,
            messagesWithUser,
            updateAssistant
          );
        } else {
          // Built-in Groq — default for everyone
          await streamBuiltinAI(
            messagesWithUser,
            updateAssistant,
            systemPrompt,
            language,
            profile
          );
        }
      } catch (err: any) {
        console.error('[useAI] streamMessage error:', err);
        showError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const generateQuiz = useCallback(async (
    topic: string,
    difficulty: string = 'intermediate'
  ): Promise<QuizQuestion[]> => {
    setLoading(true);
    setError(null);

    const language = stateRef.current.settings.defaultLanguage || 'Python';
    const hasAnthropicKey = !!stateRef.current.apiKey;
    const hasGeminiKey = !!(stateRef.current.settings as any)?.geminiApiKey;

    try {
      let raw = '';

      if (stateRef.current.settings?.provider === 'anthropic' && hasAnthropicKey) {
        const client = getAnthropicClient(stateRef.current.apiKey);
        const res = await client.messages.create({
          model: 'claude-sonnet-4-5',
          max_tokens: 2048,
          messages: [{ role: 'user', content: QUIZ_PROMPT(topic, difficulty) }],
        });
        raw = res.content[0].type === 'text' ? res.content[0].text : '';
      } else if (stateRef.current.settings?.provider === 'gemini' && hasGeminiKey) {
        return await generateGeminiQuiz(
          (stateRef.current.settings as any).geminiApiKey,
          topic,
          difficulty
        );
      } else {
        // Built-in Groq
        raw = await generateBuiltinQuiz(QUIZ_PROMPT(topic, difficulty), language, profile);
      }

      const cleaned = raw.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim();
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('Invalid quiz response. Please try again.');
      return JSON.parse(match[0]) as QuizQuestion[];
    } catch (err: any) {
      console.error('[useAI] generateQuiz error:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { streamMessage, generateQuiz, loading, error };
}
