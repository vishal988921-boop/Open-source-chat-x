import { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc,
  updateDoc,
  deleteDoc,
  where
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { parseCommand } from '../lib/commands';
import { AIMode } from '../components/ModeToggle';

const MODEL_NAME = "gemini-3-flash-preview";

const MODE_PROMPTS: Record<AIMode, string> = {
  normal: "You are Chat X, a premium AI assistant. You are helpful, creative, and professional. Use markdown for formatting. Keep responses concise unless asked otherwise.",
  study: "You are Chat X, a premium AI assistant focused on learning. Explain concepts step-by-step in simple terms. Use analogies where helpful. Use markdown for formatting.",
  creator: "You are Chat X, a premium AI assistant for creators. Generate engaging content, hooks, and scripts. Be creative, enthusiastic, and use markdown for formatting."
};

export function useChat(sessionId: string | null, mode: AIMode = 'normal') {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !auth.currentUser) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'sessions', sessionId, 'messages'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      // Sort in memory to avoid requiring a composite index
      msgs.sort((a, b) => a.timestamp - b.timestamp);
      
      setMessages(msgs);
    }, (err) => {
      // Ignore permission errors that occur when the session is deleted
      if (err.message?.includes('Missing or insufficient permissions')) {
        console.warn('Messages listener permission denied (session likely deleted)');
        return;
      }
      handleFirestoreError(err, OperationType.LIST, `sessions/${sessionId}/messages`);
    });

    return () => unsubscribe();
  }, [sessionId]);

  const sendMessage = useCallback(async (content: string, isRegenerating: boolean = false) => {
    if (!sessionId || !auth.currentUser || !content.trim()) return;

    setIsLoading(true);
    setError(null);

    const parsedContent = parseCommand(content);

    try {
      if (!isRegenerating) {
        const userMsg = {
          role: 'user',
          content: parsedContent,
          timestamp: Date.now(),
          sessionId,
          userId: auth.currentUser.uid
        };
        
        try {
          await addDoc(collection(db, 'sessions', sessionId, 'messages'), userMsg);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `sessions/${sessionId}/messages`);
        }
      }

      const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      let history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      if (isRegenerating) {
        if (history.length > 0 && history[history.length - 1].role === 'model') {
          history.pop();
        }
        if (history.length > 0 && history[history.length - 1].role === 'user') {
          history.pop();
        }
      }

      const result = await genAI.models.generateContentStream({
        model: MODEL_NAME,
        contents: [
          ...history,
          { role: 'user', parts: [{ text: parsedContent }] }
        ],
        config: {
          systemInstruction: MODE_PROMPTS[mode],
        }
      });

      let fullResponse = "";
      
      let aiMsgRef;
      try {
        aiMsgRef = await addDoc(collection(db, 'sessions', sessionId, 'messages'), {
          role: 'model',
          content: "",
          timestamp: Date.now(),
          sessionId,
          userId: auth.currentUser.uid
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `sessions/${sessionId}/messages`);
        return;
      }

      for await (const chunk of result) {
        const chunkText = chunk.text || "";
        fullResponse += chunkText;
        
        try {
          await updateDoc(aiMsgRef, {
            content: fullResponse
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `sessions/${sessionId}/messages/${aiMsgRef.id}`);
        }
      }

      if (messages.length === 0) {
        const sessionRef = doc(db, 'sessions', sessionId);
        try {
          await updateDoc(sessionRef, {
            title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
            updatedAt: Date.now()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `sessions/${sessionId}`);
        }
      }

    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message || "An error occurred while sending the message.");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, messages]);

  const regenerateResponse = useCallback(async () => {
    if (messages.length === 0) return;
    
    const lastMsg = messages[messages.length - 1];
    let lastUserMessage;

    if (lastMsg.role === 'model') {
      lastUserMessage = messages.findLast(m => m.role === 'user');
      if (!lastUserMessage) return;

      try {
        await deleteDoc(doc(db, 'sessions', sessionId!, 'messages', lastMsg.id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `sessions/${sessionId}/messages/${lastMsg.id}`);
      }
    } else {
      lastUserMessage = lastMsg;
    }

    await sendMessage(lastUserMessage.content, true);
  }, [messages, sendMessage, sessionId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    regenerateResponse
  };
}
