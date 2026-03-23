import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { MessageInput } from './MessageInput';
import { Header } from './Header';
import { Welcome } from './Welcome';
import { Layout } from './Layout';
import { useChat } from '../hooks/useChat';
import { useSessions } from '../hooks/useSessions';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { AIMode } from './ModeToggle';

export const ChatX = () => {
  const [mode, setMode] = useState<AIMode>('normal');

  const { 
    sessions, 
    currentSessionId, 
    setCurrentSessionId, 
    createNewSession, 
    deleteSession,
    togglePinSession
  } = useSessions();
  
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    regenerateResponse 
  } = useChat(currentSessionId, mode);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  useEffect(() => {
    // If the current session was deleted (e.g. from another tab), clear it
    if (currentSessionId && sessions.length > 0 && !currentSession) {
      setCurrentSessionId(null);
    }
  }, [sessions, currentSessionId, currentSession, setCurrentSessionId]);

  const handleNewChat = async () => {
    const newId = await createNewSession();
    if (newId) setCurrentSessionId(newId);
  };

  const handleLogout = () => signOut(auth);

  return (
    <Layout
      sidebar={
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewChat={handleNewChat}
          onSelectChat={setCurrentSessionId}
          onDeleteChat={deleteSession}
          onTogglePin={togglePinSession}
          onLogout={handleLogout}
          userEmail={auth.currentUser?.email || null}
        />
      }
    >
      <div className="flex flex-col h-full" id="chat-container">
        <Header 
          title={currentSession?.title || 'New Conversation'} 
          mode={mode}
          setMode={setMode}
        />
        
        {currentSessionId ? (
          <>
            <ChatArea 
              messages={messages} 
              isTyping={isLoading} 
              onRegenerate={regenerateResponse}
            />
            <MessageInput onSend={sendMessage} disabled={isLoading} />
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <Welcome />
            <div className="mt-auto">
              <MessageInput 
                onSend={async (content) => {
                  const newId = await createNewSession();
                  if (newId) {
                    setCurrentSessionId(newId);
                    // Wait for the session to be ready before sending
                    setTimeout(() => sendMessage(content), 500);
                  }
                }} 
              />
            </div>
          </div>
        )}

        {error && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-medium backdrop-blur-md z-50">
            {error}
          </div>
        )}
      </div>
    </Layout>
  );
};
