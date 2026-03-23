import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  doc,
  getDocs,
  writeBatch,
  updateDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ChatSession } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export function useSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setSessions([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sess = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatSession[];
      
      // Sort pinned sessions to the top
      sess.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.updatedAt - a.updatedAt;
      });
      
      setSessions(sess);
      setIsLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'sessions');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createNewSession = useCallback(async () => {
    if (!auth.currentUser) return null;

    const newSession = {
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId: auth.currentUser.uid,
      pinned: false
    };

    try {
      const docRef = await addDoc(collection(db, 'sessions'), newSession);
      setCurrentSessionId(docRef.id);
      return docRef.id;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'sessions');
      return null;
    }
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    if (!auth.currentUser) return;

    // Optimistically clear current session to unmount listeners
    if (currentSessionId === id) {
      setCurrentSessionId(null);
    }

    try {
      const q = query(
        collection(db, 'sessions', id, 'messages'),
        where('userId', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      batch.delete(doc(db, 'sessions', id));
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `sessions/${id}`);
    }
  }, [currentSessionId]);

  const togglePinSession = useCallback(async (id: string, currentPinned: boolean) => {
    if (!auth.currentUser) return;

    try {
      await updateDoc(doc(db, 'sessions', id), {
        pinned: !currentPinned
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `sessions/${id}`);
    }
  }, []);

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    deleteSession,
    togglePinSession,
    isLoading
  };
}
