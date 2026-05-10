import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  getAnthropicClient,
  SYSTEM_PROMPT,
  QUIZ_PROMPT,
  buildSystemPromptWithFile,
} from '@/lib/anthropic';
import { streamGeminiMessage, generateGeminiQuiz } from '@/lib/gemini';
import { truncateForContext } from '@/lib/pdfExtractor';
import type { Message, QuizQuestion } from '@/lib/types';
import { streamBuiltinAI, generateBuiltinQuiz } from '@/lib/builtinAI';

export function useAI() {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Always use latest state in async callbacks
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const streamMessage = useCallback(
    async (
      sessionId: string,
      userContent: string,
      onChunk?: (text: string) => void,
      initialSession?: any
    ) => {
      setLoading(true);
      setError(null);

      const currentState = stateRef.current;
      const session =
        initialSession ||
        currentState.sessions.find(s => s.id === sessionId);

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
        payload: {
          ...session,
          messages: messagesWithUser,
          updatedAt: Date.now(),
        },
      });

      const updateAssistant = (text: string) => {
        dispatch({
          type: 'UPDATE_SESSION',
          payload: {
            ...session,
            updatedAt: Date.now(),
            messages: [
              ...messagesWithUser,
              {
                id: assistantMsgId,
                role: 'assistant' as const,
                content: text,
                timestamp: Date.now(),
              },
            ],
          },
        });
        onChunk?.(text);
      };

      const showError = (msg: string) => {
        dispatch({
          type: 'UPDATE_SESSION',
          payload: {
            ...session,
            messages: [
              ...messagesWithUser,
              {
                id: assistantMsgId,
                role: 'assistant' as const,
                content: `⚠️ **Byte couldn't respond:** ${msg}\n\nPlease try again.`,
                timestamp: Date.now(),
              },
            ],
          },
        });
        setError(msg);
      };

      // Build context-aware system prompt if file is attached
      const systemPrompt = session.attachedFile
        ? buildSystemPromptWithFile(
            truncateForContext(session.attachedFile.text),
            session.attachedFile.name
          )
        : undefined;

      try {
        const provider = currentState.settings?.provider;

        // Priority order:
        // 1. User's Anthropic key (if provider = anthropic)
        // 2. User's Gemini key (if provider = gemini)
        // 3. Built-in Groq (DEFAULT — always works without any user key)

        if (provider === 'anthropic' && hasAnthropicKey) {
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
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              fullText += event.delta.text;
              updateAssistant(fullText);
            }
          }
        } else if (provider === 'gemini' && hasGeminiKey) {
          await streamGeminiMessage(
            (currentState.settings as any).geminiApiKey,
            messagesWithUser,
            updateAssistant
          );
        } else {
          // Built-in Groq — DEFAULT path, no key needed
          await streamBuiltinAI(
            messagesWithUser,
            updateAssistant,
            systemPrompt,
            language
          );
        }
      } catch (err: any) {
        console.error('[useAI] streamMessage error:', err);
        showError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateQuiz = useCallback(
    async (topic: string, difficulty = 'intermediate'): Promise<QuizQuestion[]> => {
      setLoading(true);
      setError(null);

      const currentState = stateRef.current;
      const language = currentState.settings.defaultLanguage || 'Python';
      const hasAnthropicKey = !!currentState.apiKey;
      const hasGeminiKey = !!(currentState.settings as any)?.geminiApiKey;
      const provider = currentState.settings?.provider;

      try {
        let raw = '';

        if (provider === 'anthropic' && hasAnthropicKey) {
          const client = getAnthropicClient(currentState.apiKey);
          const res = await client.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 2048,
            messages: [{ role: 'user', content: QUIZ_PROMPT(topic, difficulty) }],
          });
          raw = res.content[0].type === 'text' ? res.content[0].text : '';
        } else if (provider === 'gemini' && hasGeminiKey) {
          return await generateGeminiQuiz(
            (currentState.settings as any).geminiApiKey,
            topic,
            difficulty
          );
        } else {
          // Built-in Groq
          raw = await generateBuiltinQuiz(QUIZ_PROMPT(topic, difficulty), language);
        }

        const cleaned = raw.replace(/```json\n?/g, '').replace(/\n?```/g, '').trim();
        const match = cleaned.match(/\[[\s\S]*\]/);
        if (!match) throw new Error('Invalid quiz response. Try a different topic.');
        return JSON.parse(match[0]) as QuizQuestion[];
      } catch (err: any) {
        console.error('[useAI] generateQuiz error:', err);
        setError(err.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { streamMessage, generateQuiz, loading, error };
}
