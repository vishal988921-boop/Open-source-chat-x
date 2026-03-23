import { Message } from '../types';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatAreaProps {
  messages: Message[];
  isTyping?: boolean;
  onRegenerate?: () => void;
}

export const ChatArea = ({ messages, isTyping, onRegenerate }: ChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 custom-scrollbar"
    >
      <div className="max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 py-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-xl">
              <span className="text-3xl font-bold">X</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to Chat X</h2>
            <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
              Your intelligent companion for creative writing, coding, and more.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <MessageItem
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
                onRegenerate={isTyping ? undefined : onRegenerate}
              />
            ))}
          </AnimatePresence>
        )}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-6"
          >
            <TypingIndicator />
          </motion.div>
        )}
      </div>
    </div>
  );
};
