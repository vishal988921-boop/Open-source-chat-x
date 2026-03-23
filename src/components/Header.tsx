import { MoreHorizontal, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ModeToggle, AIMode } from './ModeToggle';
import { ShareButton } from './ShareButton';

interface HeaderProps {
  title: string;
  mode: AIMode;
  setMode: (mode: AIMode) => void;
}

export const Header = ({ title, mode, setMode }: HeaderProps) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-white/5 relative z-10 backdrop-blur-md bg-[var(--bg-color)]/50">
      <div className="flex items-center gap-3">
        <div className="md:hidden w-8 h-8" /> {/* Placeholder for sidebar toggle */}
        <h2 className="text-sm md:text-base font-bold text-[var(--text-color)] truncate max-w-[200px] md:max-w-md">
          {title || 'New Conversation'}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle mode={mode} setMode={setMode} />
        <ThemeSwitcher />
        <ShareButton targetId="chat-container" />
        <button className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
