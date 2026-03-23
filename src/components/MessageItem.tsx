import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
  isLast?: boolean;
  onRegenerate?: () => void;
}

export const MessageItem = ({ message, isLast, onRegenerate }: MessageItemProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-[85%] md:max-w-[75%] group relative",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "relative",
          isUser ? "chat-bubble-user" : "chat-bubble-ai"
        )}>
          <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative my-4 rounded-lg overflow-hidden border border-white/10">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-xs text-gray-400 font-mono">
                        <span>{match[1]}</span>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="!m-0 !bg-transparent !p-4"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={cn("bg-white/10 rounded px-1.5 py-0.5 font-mono text-sm", className)} {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        <div className={cn(
          "flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "justify-end" : "justify-start"
        )}>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            title={isUser ? "Copy message" : "Copy response"}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          {isLast && onRegenerate && (
            <button
              onClick={onRegenerate}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              title="Regenerate response"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
