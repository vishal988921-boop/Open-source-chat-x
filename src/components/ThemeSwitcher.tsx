import { useTheme } from '../contexts/ThemeContext';
import { Palette, Moon, Sun, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export const ThemeSwitcher = () => {
  const { theme, setTheme, accent, setAccent } = useTheme();
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

  const themes = [
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'neon', icon: Zap, label: 'Neon' },
    { id: 'minimal', icon: Sun, label: 'Minimal' },
  ] as const;

  const accents = [
    { id: 'blue', color: 'bg-blue-500' },
    { id: 'purple', color: 'bg-purple-500' },
    { id: 'emerald', color: 'bg-emerald-500' },
    { id: 'rose', color: 'bg-rose-500' },
    { id: 'amber', color: 'bg-amber-500' },
  ] as const;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        title="Theme & Accent"
      >
        <Palette size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 glass-panel rounded-xl p-3 z-50 flex flex-col gap-4"
          >
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2 px-1 uppercase tracking-wider">Theme</div>
              <div className="flex flex-col gap-1">
                {themes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                        theme === t.id ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon size={14} />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2 px-1 uppercase tracking-wider">Accent</div>
              <div className="flex gap-2 px-1">
                {accents.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAccent(a.id)}
                    className={cn(
                      "w-6 h-6 rounded-full transition-transform",
                      a.color,
                      accent === a.id ? "ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110" : "hover:scale-110"
                    )}
                    title={a.id}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
