import { useSearchParams, useNavigate } from 'react-router-dom';
import { decodeNote } from '@/lib/shareNote';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SharedNotePage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const encoded = params.get('note');
  const note = encoded ? decodeNote(encoded) : null;

  if (!note) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center space-y-4">
        <p className="text-text-muted">Invalid or expired share link.</p>
        <button onClick={() => navigate('/')} className="text-primary hover:underline text-sm font-bold">
          Go to Student Bytes →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary/30">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fade-in">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg
                             bg-primary/10 text-primary border border-primary/20">
                {note.topic}
              </span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })
                  : ''}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-tight">{note.title}</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="shrink-0 text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl
                       bg-primary hover:bg-primary-hover text-white transition-all shadow-lg shadow-primary/20"
          >
            Open App
          </button>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-sm max-w-none
                        bg-surface rounded-3xl p-8 md:p-12 border border-white/5 shadow-xl leading-relaxed">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-xl border border-white/10"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {note.content || ''}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-white/5 text-center space-y-2">
          <p className="text-xs text-text-muted font-medium">
            Shared via{' '}
            <a href="/" className="text-primary hover:underline font-bold">Student Bytes</a>
            {' '}— Your AI Study Assistant
          </p>
          <p className="text-[10px] text-text-muted/50 uppercase tracking-widest font-black">
            End-to-End Encrypted Link
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedNotePage;
