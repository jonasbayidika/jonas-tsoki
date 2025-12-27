
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DirectMessage, ChatThread } from '../types';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  setDoc,
  getDoc
} from "firebase/firestore";
import { db } from '../services/firebase';

interface ChatContextType {
  threads: ChatThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  startConversation: (partnerId: string, partnerName: string) => void;
  markAsRead: (partnerId: string) => Promise<void>;
  totalUnreadCount: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.id) {
      setThreads([]);
      return;
    }

    let unsubscribe = () => {};

    try {
        // Suppression de orderBy("lastUpdate", "desc") pour éviter l'erreur d'index manquant
        const q = query(
          collection(db, "chats"),
          where("participants", "array-contains", user.id)
        );

        unsubscribe = onSnapshot(q, (snapshot) => {
          const threadList: ChatThread[] = snapshot.docs.map(d => {
            const data = d.data();
            const partnerId = data.participants.find((id: string) => id !== user.id);
            
            return {
              partnerId,
              partnerName: data.names?.[partnerId] || "Membre Bomoko",
              partnerAvatar: data.avatars?.[partnerId],
              lastMessage: data.lastMessage ? {
                ...data.lastMessage,
                timestamp: data.lastMessage.timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
              } : null,
              unreadCount: data.unreadCounts?.[user.id] || 0
            } as ChatThread;
          });

          // TRI CÔTÉ CLIENT : Plus rapide et évite la création d'index composite
          const sortedThreads = threadList.sort((a, b) => {
             const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
             const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
             return timeB - timeA;
          });

          setThreads(sortedThreads);
        }, (error) => {
          if (error.code === 'permission-denied') {
            console.warn("Permission denied: Vérifiez vos règles Firestore.");
          } else if (error.code === 'failed-precondition') {
             console.error("Index manquant, mais normalement résolu par le tri client.");
          } else {
            console.error("Firestore Messaging Error:", error);
          }
        });

    } catch (e) {
        console.error("Listener setup failed:", e);
    }

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) return;

    const chatId = [user.id, receiverId].sort().join("_");
    const chatRef = doc(db, "chats", chatId);

    try {
      let receiverData = { firstname: 'Membre', name: 'Bomoko', companyName: '', avatar: '', companyLogo: '' };
      const receiverDoc = await getDoc(doc(db, "users", receiverId));
      if (receiverDoc.exists()) {
          receiverData = receiverDoc.data() as any;
      }

      // Mise à jour du document parent
      await setDoc(chatRef, {
        participants: [user.id, receiverId],
        lastUpdate: serverTimestamp(),
        lastMessage: {
          content,
          senderId: user.id,
          timestamp: new Date()
        },
        names: {
          [user.id]: `${user.firstname} ${user.name}`,
          [receiverId]: receiverData.companyName || `${receiverData.firstname} ${receiverData.name}`
        },
        avatars: {
          [user.id]: user.avatar || '',
          [receiverId]: receiverData.avatar || receiverData.companyLogo || ''
        },
        [`unreadCounts.${receiverId}`]: (threads.find(t => t.partnerId === receiverId)?.unreadCount || 0) + 1
      }, { merge: true });

      // Ajout du message
      const messageData = {
        senderId: user.id,
        receiverId: receiverId,
        content,
        timestamp: serverTimestamp(),
        read: false
      };
      
      await addDoc(collection(chatRef, "messages"), messageData);

    } catch (error) {
      console.error("Erreur envoi message:", error);
      throw error;
    }
  };

  const startConversation = (partnerId: string, partnerName: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActiveThreadId(partnerId);
    navigate('/messages');
  };

  const markAsRead = async (partnerId: string) => {
    if (!user) return;
    const chatId = [user.id, partnerId].sort().join("_");
    try {
      await updateDoc(doc(db, "chats", chatId), {
        [`unreadCounts.${user.id}`]: 0
      });
    } catch (e) {}
  };

  const totalUnreadCount = threads.reduce((acc, t) => acc + t.unreadCount, 0);

  return (
    <ChatContext.Provider value={{ 
      threads, 
      activeThreadId, 
      setActiveThreadId, 
      sendMessage, 
      startConversation, 
      markAsRead,
      totalUnreadCount
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
