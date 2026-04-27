import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('cpp', cpp);
import { User, Terminal, Save, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  onSave?: (content: string) => void;
  isSaved?: boolean;
  isStreaming?: boolean;
  isError?: boolean;
  onRetry?: (content: string) => void;
  retryContent?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  role,
  content,
  onSave,
  isSaved,
  isStreaming,
  isError,
  onRetry,
  retryContent
}) => {
  const isUser = role === 'user';

  return (
    <div className={cn('flex w-full mb-6 animate-fade-in', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex gap-3 max-w-[85%] md:max-w-[75%]', isUser && 'flex-row-reverse')}>
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 border',
          isUser
            ? 'bg-primary/10 border-primary/20 text-primary'
            : 'bg-white/5 border-white/5 text-primary'
        )}>
          {isUser ? <User size={18} /> : <Terminal size={18} />}
        </div>

        <div className="space-y-2 flex-1">
          <div className={cn(
            'p-5 rounded-[1.5rem] text-sm leading-relaxed transition-all duration-300',
            isUser
              ? 'bg-gradient-to-br from-primary to-primary-hover text-white rounded-tr-none shadow-xl shadow-primary/10' :
            isError
              ? 'bg-error/5 border-error/20 text-error rounded-tl-none' :
              'glass rounded-tl-none text-text/90 shadow-lg'
          )}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : (
              <div className="prose prose-invert max-w-none prose-sm">
                <ReactMarkdown
                  components={{
                    p({ children }) {
                      return (
                        <p className="mb-4 last:mb-0">
                          {children}
                          {isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse align-middle">▋</span>}
                        </p>
                      );
                    },
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg !my-4 !bg-bg border border-border"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={cn("bg-bg px-1.5 py-0.5 rounded text-primary border border-border", className)} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {!isUser && isError && onRetry && retryContent && (
            <div className="flex justify-start">
              <button
                onClick={() => onRetry(retryContent)}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-error/20 text-error hover:bg-error/30 transition-all"
              >
                <RefreshCw size={10} /> Retry
              </button>
            </div>
          )}

          {!isUser && !isError && onSave && (
            <div className="flex justify-start">
              <button
                onClick={() => onSave(content)}
                disabled={isSaved}
                className={cn(
                  "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-all",
                  isSaved ? "bg-success/20 text-success" : "text-text-muted hover:text-text hover:bg-white/5"
                )}
              >
                {isSaved ? (
                  <>
                    <Check size={10} /> Saved to Notes
                  </>
                ) : (
                  <>
                    <Save size={10} /> Save as Note
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
