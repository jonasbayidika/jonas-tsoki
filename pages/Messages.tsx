
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { 
  Send, Search, User, MessageSquare, MoreVertical, 
  ArrowLeft, Check, CheckCheck, Loader2, Sparkles, 
  Plus, UserPlus, X, Mail, AlertCircle, Clock, Info,
  Phone, Video, ShieldCheck, Smile, Paperclip, 
  MessageCirclePlus
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

interface MessagesProps {
  isDashboardView?: boolean;
}

const Messages: React.FC<MessagesProps> = ({ isDashboardView = false }) => {
  const { user } = useAuth();
  const { threads, activeThreadId, setActiveThreadId, sendMessage, markAsRead } = useChat();
  const [inputText, setInputText] = useState('');
  const [currentMessages, setCurrentMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [partnerData, setPartnerData] = useState<any>(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatEmail, setNewChatEmail] = useState('');
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const fetchPartner = async () => {
      if (!activeThreadId) {
        setPartnerData(null);
        return;
      }
      try {
        const d = await getDoc(doc(db, "users", activeThreadId));
        if (d.exists()) {
          setPartnerData({ id: d.id, ...d.data() });
        }
      } catch (e) {
        console.error("Error fetching partner:", e);
      }
    };
    fetchPartner();
  }, [activeThreadId]);

  useEffect(() => {
    if (!user || !activeThreadId) {
      setCurrentMessages([]);
      return;
    }

    setIsLoadingMessages(true);
    const chatId = [user.id, activeThreadId].sort().join("_");
    
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        timestamp: d.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString()
      }));
      setCurrentMessages(msgs);
      setIsLoadingMessages(false);
      markAsRead(activeThreadId);
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, (error) => {
      console.error("Firestore Listener Error:", error);
      setIsLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [user, activeThreadId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThreadId) return;
    const text = inputText;
    setInputText('');
    await sendMessage(activeThreadId, text);
  };

  const handleStartNewChatByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setIsSearchingUser(true);

    const emailToSearch = newChatEmail.trim().toLowerCase();
    
    if (emailToSearch === user?.email?.toLowerCase()) {
        setSearchError("Vous ne pouvez pas démarrer une discussion avec vous-même.");
        setIsSearchingUser(false);
        return;
    }

    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", emailToSearch), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            setSearchError("Cet utilisateur n'existe pas sur Bomoko.");
        } else {
            const foundUserId = querySnapshot.docs[0].id;
            setActiveThreadId(foundUserId);
            setIsNewChatModalOpen(false);
            setNewChatEmail('');
        }
    } catch (err) {
        setSearchError("Une erreur est survenue lors de la recherche.");
    } finally {
        setIsSearchingUser(false);
    }
  };

  const formatLastSeen = (timestamp: any) => {
    if (!timestamp) return "Hors ligne";
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return `Vu à ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (!user) return null;

  return (
    <div className={`flex overflow-hidden bg-[#F1F5F9] ${isDashboardView ? 'h-full rounded-[2.5rem] border border-slate-200/50 shadow-2xl' : 'h-[calc(100vh-64px)]'}`}>
      
      {/* --- SIDEBAR : LISTE DES DISCUSSIONS --- */}
      <div className={`w-full md:w-[420px] bg-white/70 backdrop-blur-2xl border-r border-slate-200/60 flex flex-col z-20 ${activeThreadId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 pb-4">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Messages</h1>
            
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cdr-blue transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Chercher une conversation..." 
                    className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border border-slate-200/50 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Liste défilante */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4 custom-scrollbar">
            {threads.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                    <MessageSquare size={48} className="mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest leading-relaxed">Commencez à bâtir<br/>votre réseau</p>
                </div>
            ) : (
                threads.filter(t => t.partnerName.toLowerCase().includes(searchQuery.toLowerCase())).map(thread => (
                    <div 
                        key={thread.partnerId}
                        onClick={() => setActiveThreadId(thread.partnerId)}
                        className={`p-5 rounded-[2.2rem] cursor-pointer transition-all duration-500 group flex items-center gap-5 border ${
                            activeThreadId === thread.partnerId 
                            ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-slate-300 -translate-y-1' 
                            : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg'
                        }`}
                    >
                        <div className="relative shrink-0">
                            <div className={`w-16 h-16 rounded-[1.4rem] flex items-center justify-center font-black overflow-hidden border-4 transition-transform group-hover:rotate-3 ${activeThreadId === thread.partnerId ? 'border-slate-800' : 'border-slate-50 bg-slate-100 text-slate-400'}`}>
                                {thread.partnerAvatar ? (
                                    <img src={thread.partnerAvatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xl">{thread.partnerName.charAt(0)}</span>
                                )}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-[3px] border-white shadow-sm"></div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className={`font-black text-sm truncate ${activeThreadId === thread.partnerId ? 'text-white' : 'text-slate-800'}`}>{thread.partnerName}</h3>
                                <span className={`text-[9px] font-black uppercase whitespace-nowrap ${activeThreadId === thread.partnerId ? 'text-slate-400' : 'text-slate-300'}`}>
                                    {thread.lastMessage ? new Date(thread.lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                </span>
                            </div>
                            <p className={`text-[11px] font-medium truncate flex items-center gap-1.5 ${activeThreadId === thread.partnerId ? 'text-slate-400/80' : 'text-slate-500'}`}>
                                {thread.lastMessage?.senderId === user.id && <Check size={14} className="shrink-0 opacity-50" />}
                                {thread.lastMessage?.content || "Aucun message..."}
                            </p>
                        </div>
                        {thread.unreadCount > 0 && (
                            <div className="w-6 h-6 bg-cdr-red text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                {thread.unreadCount}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>

        {/* --- BOUTON AJOUTER EN BAS --- */}
        <div className="p-6 bg-white border-t border-slate-100">
            <button 
                onClick={() => setIsNewChatModalOpen(true)}
                className="w-full py-4 bg-cdr-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-200 transform active:scale-95 flex items-center justify-center gap-3 group"
            >
                <MessageCirclePlus size={20} className="group-hover:rotate-12 transition-transform" />
                Nouvelle discussion
            </button>
        </div>
      </div>

      {/* --- ZONE DE CHAT PRINCIPALE --- */}
      <div className={`flex-1 flex flex-col bg-white relative ${!activeThreadId ? 'hidden md:flex' : 'flex'}`}>
        {!activeThreadId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fadeIn bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white">
                <div className="w-48 h-48 bg-white rounded-[4rem] shadow-2xl flex items-center justify-center mb-12 border border-slate-100 relative group">
                    <div className="absolute inset-0 bg-cdr-blue/5 rounded-[4rem] animate-ping group-hover:animate-none opacity-20"></div>
                    <MessageSquare size={80} className="text-cdr-blue opacity-10 group-hover:opacity-30 transition-opacity" />
                    <Sparkles className="absolute top-8 right-8 text-cdr-yellow animate-bounce" size={32} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Connectez-vous à l'avenir</h2>
                <p className="text-slate-400 font-medium max-w-sm leading-relaxed italic text-lg">Sélectionnez une discussion ou commencez-en une nouvelle pour échanger avec la communauté.</p>
            </div>
        ) : (
            <>
                {/* HEADER DU CHAT */}
                <div className="bg-white/90 backdrop-blur-xl px-8 py-5 border-b border-slate-100 flex items-center justify-between z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-5 min-w-0">
                        <button onClick={() => setActiveThreadId(null)} className="md:hidden p-3 bg-slate-50 text-slate-500 rounded-2xl hover:text-slate-900 transition-all"><ArrowLeft size={20} /></button>
                        <div className="w-14 h-14 bg-cdr-blue rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-blue-100 shrink-0 overflow-hidden border-2 border-white transform hover:rotate-3 transition-transform">
                             {partnerData?.avatar || partnerData?.companyLogo ? (
                                 <img src={partnerData?.avatar || partnerData?.companyLogo} className="w-full h-full object-cover" alt="" />
                             ) : (
                                 <span className="text-2xl">{(partnerData?.firstname || partnerData?.companyName || 'M').charAt(0)}</span>
                             )}
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-black text-slate-900 text-xl truncate leading-none mb-1.5 flex items-center gap-2">
                                {partnerData ? (partnerData.companyName || `${partnerData.firstname} ${partnerData.name}`) : "Chargement..."}
                                {partnerData?.isCertified && <ShieldCheck size={18} className="text-cdr-blue" />}
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${partnerData ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {partnerData ? formatLastSeen(partnerData.lastSeen) : "..."}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 text-slate-300 hover:bg-slate-50 hover:text-cdr-blue rounded-2xl transition-all hidden sm:block"><Phone size={22}/></button>
                        <button className="p-3 text-slate-300 hover:bg-slate-50 hover:text-cdr-red rounded-2xl transition-all hidden sm:block"><Video size={22}/></button>
                        <button className="p-3 text-slate-300 hover:bg-slate-50 hover:text-slate-600 rounded-2xl transition-all"><MoreVertical size={24} /></button>
                    </div>
                </div>

                {/* LISTE DES MESSAGES */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
                    {isLoadingMessages ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-cdr-blue" size={40} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchro Bomoko...</p>
                        </div>
                    ) : (
                        currentMessages.map((msg, i) => {
                            const isMe = msg.senderId === user.id;
                            const showAvatar = i === 0 || currentMessages[i-1].senderId !== msg.senderId;
                            
                            return (
                                <div key={msg.id} className={`flex items-end gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-slideUp`}>
                                    {!isMe && (
                                        <div className="w-10 h-10 shrink-0">
                                            {showAvatar && (
                                                <div className="w-10 h-10 bg-white rounded-xl overflow-hidden border-2 border-white shadow-sm">
                                                    {partnerData?.avatar ? <img src={partnerData.avatar} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-300 uppercase">B</div>}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className={`max-w-[80%] md:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`px-6 py-4 shadow-xl text-sm leading-relaxed font-medium transition-all ${
                                            isMe 
                                            ? 'bg-slate-900 text-white rounded-[2rem] rounded-br-none' 
                                            : 'bg-white text-slate-800 rounded-[2rem] rounded-bl-none border border-slate-100'
                                        }`}>
                                            <p>{msg.content}</p>
                                        </div>
                                        <div className={`text-[9px] font-black mt-2 flex items-center gap-1.5 uppercase opacity-30 tracking-widest ${isMe ? 'mr-4' : 'ml-4'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            {isMe && (msg.read ? <CheckCheck size={14} className="text-cdr-blue" /> : <Check size={14} />)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* ZONE DE SAISIE FLOTTANTE */}
                <div className="px-8 pb-10 pt-4">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSend} className="flex gap-4 items-end bg-white p-3 rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 focus-within:shadow-[0_25px_60px_-15px_rgba(0,119,255,0.2)] focus-within:border-cdr-blue/20 transition-all">
                            <div className="flex gap-1 mb-1 ml-2">
                                <button type="button" className="p-3 text-slate-400 hover:text-cdr-blue hover:bg-blue-50 rounded-full transition"><Paperclip size={20}/></button>
                                <button type="button" className="p-3 text-slate-400 hover:text-cdr-yellow hover:bg-yellow-50 rounded-full transition hidden sm:block"><Smile size={20}/></button>
                            </div>
                            
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Écrire un Mbote..."
                                className="flex-1 resize-none bg-transparent border-none rounded-[2rem] px-2 py-4 focus:outline-none font-bold text-base max-h-40 min-h-[56px] text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                            />
                            
                            <button 
                                type="submit" 
                                disabled={!inputText.trim()}
                                className="p-5 bg-cdr-blue text-white rounded-full hover:bg-blue-700 disabled:opacity-20 transition-all shadow-2xl shadow-blue-500/20 group transform active:scale-90"
                            >
                                <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </>
        )}
      </div>

      {/* MODAL : RECHERCHE PAR EMAIL */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-slideUp border border-white/20">
                <div className="bg-slate-900 p-10 text-white relative text-center">
                    <button onClick={() => setIsNewChatModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition"><X size={24} /></button>
                    <div className="w-24 h-24 bg-cdr-blue/10 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto border border-white/10 shadow-inner">
                        <UserPlus size={48} className="text-cdr-blue" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Trouver un membre</h2>
                    <p className="text-slate-400 text-sm mt-2 font-medium italic">Saisissez l'adresse email exacte du membre.</p>
                </div>
                
                <form onSubmit={handleStartNewChatByEmail} className="p-10 space-y-8">
                    {searchError && (
                        <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-2xl flex items-center gap-4 animate-shake">
                            <AlertCircle className="text-red-500 shrink-0" size={24} />
                            <p className="text-[11px] font-black text-red-800 uppercase tracking-wide">{searchError}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Identifiant e-mail</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
                            <input 
                                required
                                type="email"
                                value={newChatEmail}
                                onChange={(e) => setNewChatEmail(e.target.value)}
                                placeholder="ex: kabongo@bomoko.cd"
                                className="w-full pl-14 pr-6 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none font-black text-slate-700 focus:ring-4 focus:ring-blue-100 transition-all text-lg"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSearchingUser || !newChatEmail.trim()}
                        className="w-full py-6 bg-cdr-blue text-white font-black rounded-[2rem] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-4 disabled:opacity-50 text-base uppercase tracking-widest transform active:scale-95"
                    >
                        {isSearchingUser ? <Loader2 className="animate-spin" /> : <>Initier le contact</>}
                    </button>
                </form>
            </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0077FF; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default Messages;
