import { Send, PlusCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 pb-6 pt-2">
      <div className="relative flex items-end gap-2 glass-input rounded-2xl p-2 pr-3 shadow-2xl">
        <button
          className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          title="Add attachment"
        >
          <PlusCircle size={20} />
        </button>
        
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or use /commands..."
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus:ring-0 text-gray-100 placeholder-gray-500 py-2.5 resize-none text-sm md:text-base max-h-[200px] overflow-y-auto"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className={cn(
            "p-2.5 rounded-xl transition-all",
            input.trim() && !disabled
              ? "bg-[var(--accent-color)] text-white shadow-lg"
              : "bg-white/5 text-gray-600 cursor-not-allowed"
          )}
        >
          <Send size={18} />
        </motion.button>
      </div>
      <p className="text-[10px] text-center mt-2 text-gray-500 uppercase tracking-widest font-medium opacity-50">
        Chat X AI can make mistakes. Check important info.
      </p>
    </div>
  );
};
