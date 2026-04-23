import { useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getAnthropicClient, SYSTEM_PROMPT, QUIZ_PROMPT, buildSystemPromptWithFile } from '@/lib/anthropic';
import { streamGeminiMessage, generateGeminiQuiz } from '@/lib/gemini';
import { truncateForContext } from '@/lib/pdfExtractor';
import type { Message, QuizQuestion } from '@/lib/types';

export function useAI() {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamMessage = useCallback(
    async (sessionId: string, userContent: string, onChunk?: (text: string) => void) => {
      const hasKey = state.settings.provider === 'gemini'
        ? !!state.settings.geminiApiKey
        : !!state.apiKey;

      if (!hasKey) {
        setError('API key missing. Add it in Settings.');
        return;
      }

      setLoading(true);
      setError(null);

      const session = state.sessions.find(s => s.id === sessionId);
      if (!session) return;

      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userContent,
        timestamp: Date.now()
      };

      const messagesWithUser = [...session.messages, newUserMessage];
      dispatch({
        type: 'UPDATE_SESSION',
        payload: { ...session, messages: messagesWithUser, updatedAt: Date.now() }
      });

      try {
        const assistantMsgId = `msg_${Date.now()}`;

        const systemPrompt = session.attachedFile
          ? buildSystemPromptWithFile(
              truncateForContext(session.attachedFile.text),
              session.attachedFile.name
            )
          : SYSTEM_PROMPT;

        console.log('[useAI] Sending to', state.settings.provider, 'model: claude-sonnet-4-5');
        console.log('[useAI] API key present:', state.settings.provider === 'gemini' ? !!state.settings.geminiApiKey : !!state.apiKey);
        console.log('[useAI] Messages count:', messagesWithUser.length);

        if (state.settings.provider === 'gemini') {
          const geminiKey = state.settings.geminiApiKey;
          if (!geminiKey) {
            setError('Gemini API key is missing. Add it in Settings.');
            setLoading(false);
            return;
          }
          await streamGeminiMessage(
            geminiKey,
            messagesWithUser,
            (text) => {
              dispatch({
                type: 'UPDATE_SESSION',
                payload: {
                  ...session,
                  updatedAt: Date.now(),
                  messages: [
                    ...messagesWithUser,
                    { id: assistantMsgId, role: 'assistant', content: text, timestamp: Date.now() }
                  ]
                }
              });
              if (onChunk) onChunk(text);
            },
            systemPrompt
          );
        } else {
          const client = getAnthropicClient(state.apiKey);
          const stream = await client.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 1024,
            system: systemPrompt,
            messages: messagesWithUser.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            stream: true,
          });

          let fullText = '';

          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              fullText += event.delta.text;

              dispatch({
                type: 'UPDATE_SESSION',
                payload: {
                  ...session,
                  updatedAt: Date.now(),
                  messages: [
                    ...messagesWithUser,
                    {
                      id: assistantMsgId,
                      role: 'assistant',
                      content: fullText,
                      timestamp: Date.now()
                    }
                  ]
                }
              });

              if (onChunk) onChunk(fullText);
            }
          }
        }
      } catch (err: any) {
        console.error('[useAI] Full error:', err);
        console.error('[useAI] Error status:', err.status);
        console.error('[useAI] Error message:', err.message);
        const errorMessage = err.message || 'Failed to get response from AI.';
        setError(errorMessage);

        dispatch({
          type: 'UPDATE_SESSION',
          payload: {
            ...session,
            updatedAt: Date.now(),
            messages: [
              ...messagesWithUser,
              {
                id: Date.now().toString(),
                role: 'assistant',
                content: `Byte couldn't respond: ${errorMessage}. Try again?`,
                timestamp: Date.now(),
                isError: true,
                retryContent: userContent,
              },
            ],
          },
        });
      } finally {
        setLoading(false);
      }
    },
    [state.apiKey, state.settings, state.sessions, dispatch]
  );

  const generateQuiz = useCallback(
    async (topic: string, difficulty: string = 'intermediate'): Promise<QuizQuestion[]> => {
      const hasKey = state.settings.provider === 'gemini'
        ? !!state.settings.geminiApiKey
        : !!state.apiKey;

      if (!hasKey) {
        setError('API key missing. Add it in Settings.');
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        if (state.settings.provider === 'gemini') {
          const geminiKey = state.settings.geminiApiKey;
          if (!geminiKey) { setError('Gemini API key is missing.'); return []; }
          return await generateGeminiQuiz(geminiKey, topic, difficulty);
        } else {
          const client = getAnthropicClient(state.apiKey);
          const response = await client.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 2048,
            messages: [
              {
                role: 'user',
                content: QUIZ_PROMPT(topic, difficulty),
              },
            ],
          });

          const content = response.content[0].type === 'text' ? response.content[0].text : '';

          // Strip markdown fences if present
          const cleanedContent = content.replace(/```json\n?/, '').replace(/\n?```/, '').trim();

          const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            try {
              return JSON.parse(jsonMatch[0]) as QuizQuestion[];
            } catch (parseErr) {
              console.error('JSON Parse Error:', parseErr);
              throw new Error('Quiz generation failed — try a different topic.');
            }
          }
          throw new Error('Quiz generation failed — try a different topic.');
        }
      } catch (err: any) {
        console.error('Quiz Generation Error:', err);
        setError(err.message || 'Failed to generate quiz.');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [state.apiKey, state.settings]
  );

  return { streamMessage, generateQuiz, loading, error };
}
