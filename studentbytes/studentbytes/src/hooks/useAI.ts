import { useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getAnthropicClient, SYSTEM_PROMPT, QUIZ_PROMPT } from '@/lib/anthropic';
import type { Message, QuizQuestion, Session } from '@/lib/types';

export function useAI() {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamMessage = useCallback(
    async (sessionId: string, userContent: string, onChunk?: (text: string) => void) => {
      if (!state.apiKey) {
        setError('Anthropic API key is missing. Please add it in settings.');
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

      const updatedSession: Session = {
        ...session,
        messages: [...session.messages, newUserMessage],
        updatedAt: Date.now()
      };

      dispatch({ type: 'UPDATE_SESSION', payload: updatedSession });

      try {
        const client = getAnthropicClient(state.apiKey);
        const stream = await client.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: updatedSession.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          stream: true,
        });

        let fullText = '';
        const assistantMsgId = (Date.now() + 1).toString();

        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullText += event.delta.text;

            const assistantMessage: Message = {
              id: assistantMsgId,
              role: 'assistant',
              content: fullText,
              timestamp: Date.now()
            };

            dispatch({
              type: 'UPDATE_SESSION',
              payload: {
                ...updatedSession,
                messages: [...updatedSession.messages, assistantMessage]
              }
            });

            if (onChunk) onChunk(fullText);
          }
        }
      } catch (err: any) {
        console.error('AI Error:', err);
        const errorMessage = err.message || 'Failed to get response from AI.';
        setError(errorMessage);

        dispatch({
          type: 'UPDATE_SESSION',
          payload: {
            ...updatedSession,
            messages: [
              ...updatedSession.messages,
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
    [state.apiKey, state.sessions, dispatch]
  );

  const generateQuiz = useCallback(
    async (topic: string, difficulty: string = 'intermediate'): Promise<QuizQuestion[]> => {
      if (!state.apiKey) {
        setError('Anthropic API key is missing.');
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const client = getAnthropicClient(state.apiKey);
        const response = await client.messages.create({
          model: 'claude-3-5-sonnet-20241022',
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
      } catch (err: any) {
        console.error('Quiz Generation Error:', err);
        setError(err.message || 'Failed to generate quiz.');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [state.apiKey]
  );

  return { streamMessage, generateQuiz, loading, error };
}
