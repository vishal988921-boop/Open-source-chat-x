import { Plus, MessageSquare, Trash2, LogOut, Menu, X, Settings, User, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onTogglePin: (id: string, currentPinned: boolean) => void;
  onLogout: () => void;
  userEmail: string | null;
}

export const Sidebar = ({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onTogglePin,
  onLogout,
  userEmail
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeContextMenu, setActiveContextMenu] = useState<string | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = () => setActiveContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handlePressStart = (id: string) => {
    pressTimer.current = setTimeout(() => {
      setActiveContextMenu(id);
    }, 500); // 500ms long press
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const pinnedSessions = sessions.filter(s => s.pinned);
  const unpinnedSessions = sessions.filter(s => !s.pinned);

  const renderSessionList = (list: ChatSession[], label: string) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-4">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2 opacity-50">
          {label}
        </div>
        {list.map((session) => (
          <div
            key={session.id}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer relative mb-1",
              currentSessionId === session.id
                ? "bg-white/10 text-white shadow-lg border border-white/10"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onSelectChat(session.id);
              setActiveContextMenu(null);
            }}
            onTouchStart={() => handlePressStart(session.id)}
            onTouchEnd={handlePressEnd}
            onTouchMove={handlePressEnd}
            onMouseDown={() => handlePressStart(session.id)}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
          >
            <MessageSquare size={16} className={cn(
              "shrink-0",
              currentSessionId === session.id ? "text-[var(--accent-color)]" : "text-gray-500"
            )} />
            <span className="truncate text-sm font-medium flex-1">
              {session.title || 'Untitled Chat'}
            </span>
            <div className={cn(
              "flex items-center gap-1 transition-opacity",
              activeContextMenu === session.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(session.id, !!session.pinned);
                  setActiveContextMenu(null);
                }}
                className={cn(
                  "p-1 rounded-lg hover:bg-white/10 transition-all",
                  session.pinned ? "text-[var(--accent-color)]" : "text-gray-500 hover:text-white"
                )}
                title={session.pinned ? "Unpin chat" : "Pin chat"}
              >
                <Pin size={14} className={session.pinned ? "fill-current" : ""} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(session.id);
                  setActiveContextMenu(null);
                }}
                className="p-1 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                title="Delete chat"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl glass-panel text-gray-400 hover:text-white md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed md:relative z-40 w-[280px] h-screen glass-panel border-r border-white/5 flex flex-col"
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-color)] to-[var(--accent-hover)] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    X
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Chat X
                  </h1>
                </div>
                <button
                  onClick={onNewChat}
                  className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all group"
                  title="New Chat"
                >
                  <Plus size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                {sessions.length === 0 ? (
                  <div className="px-3 py-8 text-center text-sm text-gray-500 italic">
                    No chats yet. Start a new one!
                  </div>
                ) : (
                  <>
                    {renderSessionList(pinnedSessions, 'Pinned')}
                    {renderSessionList(unpinnedSessions, 'Recent')}
                  </>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/10">
                    <User size={16} />
                  </div>
                  <div className="flex-1 truncate text-xs font-medium">
                    {userEmail || 'Guest User'}
                  </div>
                </div>
                
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
