import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export type AIMode = 'normal' | 'study' | 'creator';

interface ModeToggleProps {
  mode: AIMode;
  setMode: (mode: AIMode) => void;
}

export const ModeToggle = ({ mode, setMode }: ModeToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const modes = [
    { id: 'normal', icon: Brain, label: 'Normal', desc: 'Balanced, helpful responses' },
    { id: 'study', icon: BookOpen, label: 'Study', desc: 'Step-by-step explanations' },
    { id: 'creator', icon: Sparkles, label: 'Creator', desc: 'Engaging content & hooks' },
  ] as const;

  const currentMode = modes.find(m => m.id === mode) || modes[0];
  const CurrentIcon = currentMode.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors border border-white/5"
        title="AI Mode"
      >
        <CurrentIcon size={16} className="text-[var(--accent-color)]" />
        <span className="text-sm font-medium">{currentMode.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 glass-panel rounded-xl p-2 z-50 flex flex-col gap-1"
          >
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-start gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                    mode === m.id ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon size={18} className={cn("mt-0.5", mode === m.id ? "text-[var(--accent-color)]" : "text-gray-500")} />
                  <div>
                    <div className="text-sm font-medium">{m.label}</div>
                    <div className="text-xs text-gray-500">{m.desc}</div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
