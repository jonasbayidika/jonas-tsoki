
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
    User, Briefcase, LogOut, LayoutDashboard, Bell, 
    Award, TrendingUp, Presentation, Users, Lock, Crown, PlusCircle, Megaphone,
    ShoppingBag, ChevronRight, Loader2, BookOpen, Star, PlayCircle, 
    MessageSquare, CheckCircle2, Clock, ArrowRight, Settings, ExternalLink, MapPin, Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { UserRole, Training, Job, Classified } from '../types';
import { collection, query, getDocs, limit, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import Messages from './Messages';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalUnreadCount, activeThreadId, setActiveThreadId } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChartMounted, setIsChartMounted] = useState(false);

  // Auto-switch to messages if activeThreadId is set from outside
  useEffect(() => {
    if (activeThreadId) {
      setActiveTab('messages');
    }
  }, [activeThreadId]);

  // Data States
  const [enrolledTrainings, setEnrolledTrainings] = useState<Training[]>([]);
  const [mySales, setMySales] = useState<Classified[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const isFormateur = user?.role === UserRole.FORMATEUR;
  const isPartner = user?.role === UserRole.PARTNER;
  const isCandidat = user?.role === UserRole.CLIENT;
  const hasSubscription = user?.subscriptionTier && user?.subscriptionTier !== 'standard';

  useEffect(() => {
    const timer = setTimeout(() => setIsChartMounted(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        if (!user) return;
        setIsLoadingData(true);
        try {
            if (activeTab === 'my-content') {
                const qTrainings = query(collection(db, "trainings"));
                const snapTrainings = await getDocs(qTrainings);
                const allTrainings = snapTrainings.docs.map(d => ({ id: d.id, ...d.data() } as Training));
                
                if (isFormateur) {
                    setEnrolledTrainings(allTrainings.filter(t => t.instructorId === user.id));
                } else {
                    setEnrolledTrainings(allTrainings.filter(t => user.enrolledCourses?.includes(t.id)));
                }

                const storedKoop = localStorage.getItem('bomoko_koop');
                if (storedKoop) {
                    const allSales = JSON.parse(storedKoop) as Classified[];
                    setMySales(allSales.filter(s => s.sellerId === user.id));
                }
            }

            if (activeTab === 'alerts') {
                if (isPartner) {
                    setNotifications([
                        { id: 1, type: 'app', title: 'Nouvelle Candidature', desc: 'Un candidat a postulé à votre offre "Développeur React".', time: '2h ago', icon: <Briefcase size={18}/>, color: 'text-blue-600 bg-blue-50', link: '/my-office' },
                        { id: 2, type: 'member', title: 'Adhésion Club', desc: 'Malko rejoint votre communauté Entrepreneuriat.', time: '5h ago', icon: <Users size={18}/>, color: 'text-green-600 bg-green-50', link: '/communities' }
                    ]);
                } else {
                    const qJobs = query(collection(db, "jobs"), limit(2), orderBy("createdAt", "desc"));
                    const snapJobs = await getDocs(qJobs);
                    const newJobs = snapJobs.docs.map(d => ({
                        id: d.id,
                        title: 'Opportunité : ' + (d.data() as Job).title,
                        desc: 'Une nouvelle offre d\'emploi vient d\'être publiée.',
                        time: 'Nouveau',
                        icon: <Briefcase size={18}/>,
                        color: 'text-cdr-red bg-red-50',
                        link: '/jobs'
                    }));

                    const qTrainings = query(collection(db, "trainings"), limit(1), orderBy("createdAt", "desc"));
                    const snapTrainings = await getDocs(qTrainings);
                    const newTrainings = snapTrainings.docs.map(d => ({
                        id: d.id,
                        title: 'Formation Flash',
                        desc: 'Le cours "' + (d.data() as Training).title + '" est disponible.',
                        time: 'Récent',
                        icon: <BookOpen size={18}/>,
                        color: 'text-cdr-blue bg-blue-50',
                        link: '/services/training'
                    }));

                    setNotifications([...newJobs, ...newTrainings]);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingData(false);
        }
    };
    fetchData();
  }, [activeTab, user]);

  if (!user) return null;

  const chartData = [
    { name: 'Lun', val: 12 }, { name: 'Mar', val: 19 }, { name: 'Mer', val: 32 },
    { name: 'Jeu', val: 25 }, { name: 'Ven', val: 40 }, { name: 'Sam', val: 28 }, { name: 'Dim', val: 15 },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Vue d\'ensemble', icon: <LayoutDashboard size={20} /> },
    { id: 'profile', label: 'Profil Public', icon: <User size={20} /> },
    { id: 'my-content', label: 'Mon Contenu', icon: <Presentation size={20} /> },
    { id: 'messages', label: 'Messagerie', icon: <MessageSquare size={20} />, badge: totalUnreadCount },
    { id: 'alerts', label: 'Notifications', icon: <Bell size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed md:relative z-40 w-72 h-full min-h-screen bg-slate-900 text-white transition-transform duration-500 shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 bg-white flex justify-center border-b border-slate-800/10">
          <Link to="/">
            <img src="bomoko logo.png" alt="BOMOKO" className="h-10 w-auto object-contain" />
          </Link>
        </div>
        
        <div className="p-6">
            <div className="flex items-center gap-4 mb-10 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-12 h-12 bg-cdr-blue rounded-xl flex items-center justify-center font-black text-xl border-2 border-white/20 overflow-hidden shrink-0">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                    <p className="font-black text-sm truncate">{user.firstname} {user.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.role}</p>
                </div>
            </div>

            <nav className="space-y-2">
            {menuItems.map((item) => (
                <button 
                    key={item.id} 
                    onClick={() => { setActiveTab(item.id); if(item.id !== 'messages') setActiveThreadId(null); setSidebarOpen(false); }} 
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === item.id ? 'bg-cdr-blue text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <div className="flex items-center gap-4">
                        {item.icon} {item.label}
                    </div>
                    {item.badge && item.badge > 0 ? (
                        <span className="bg-cdr-red text-white text-[10px] px-2 py-0.5 rounded-full">{item.badge}</span>
                    ) : null}
                </button>
            ))}
            </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5 space-y-3">
            <Link to="/my-office" className="w-full flex items-center gap-4 px-5 py-3 text-cdr-yellow hover:text-white transition font-black text-sm">
                <Briefcase size={18} /> Mon Bureau Pro
            </Link>
            <button onClick={logout} className="w-full flex items-center gap-4 px-5 py-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition font-bold text-sm">
                <LogOut size={18} /> Déconnexion
            </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center border-b border-slate-200 sticky top-0 z-50">
          <img src="bomoko logo.png" className="h-8 w-auto" alt="" />
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-100 rounded-xl"><LayoutDashboard size={24} /></button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 overflow-y-auto h-screen ${activeTab === 'messages' ? 'bg-white p-0' : 'bg-slate-50 p-4 md:p-10'}`}>
        
        {/* TAB: MESSAGES (Plein écran dans la zone main) */}
        {activeTab === 'messages' && (
          <div className="h-full animate-fadeIn">
            <Messages isDashboardView={true} />
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Espace Personnel</h1>
                    <p className="text-slate-500 font-medium">Pilotez votre réussite sur Bomoko.</p>
                </div>
                <Link to="/subscription" className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-black flex items-center gap-3 shadow-xl">
                    <Crown size={16} className="text-yellow-400" /> Mode Professionnel
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                <div className="p-4 bg-blue-50 text-cdr-blue rounded-2xl w-fit mb-6"><TrendingUp size={28} /></div>
                <div className="text-4xl font-black text-slate-900">{isCandidat ? (user.enrolledCourses?.length || 0) : '0'}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Formations Actives</div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                <div className="p-4 bg-yellow-50 text-cdr-yellow rounded-2xl w-fit mb-6"><ShoppingBag size={28} /></div>
                <div className="text-4xl font-black text-slate-900">{mySales.length}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Annonces KOOP</div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                <div className="p-4 bg-green-50 text-cdr-green rounded-2xl w-fit mb-6"><Award size={28} /></div>
                <div className="text-4xl font-black text-slate-900">{user.isCertified ? '100%' : '20%'}</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Score Profil</div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
                <h3 className="font-black text-xl mb-10 flex items-center gap-3"><TrendingUp className="text-cdr-blue" /> Croissance Hebdomadaire</h3>
                <div className="w-full h-[350px]">
                    {isChartMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="val" fill="#0077FF" radius={[10, 10, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>
                    )}
                </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFIL PUBLIC */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
                <div className="h-48 bg-slate-900 relative">
                    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-40" alt="" />
                    <div className="absolute bottom-4 right-6">
                        <button onClick={() => navigate('/profile')} className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase flex items-center gap-2 shadow-xl hover:bg-slate-50 transition-all">
                             <Eye size={16} /> Aperçu Public
                        </button>
                    </div>
                </div>
                <div className="px-10 pb-12 -mt-16 relative">
                    <div className="flex flex-col md:flex-row items-end gap-6 mb-10">
                        <div className="w-40 h-40 bg-white rounded-[2.5rem] p-1.5 shadow-2xl border-4 border-white overflow-hidden">
                             {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-[2.2rem]" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 font-black text-4xl">{user.name.charAt(0)}</div>}
                        </div>
                        <div className="pb-4">
                            <h2 className="text-3xl font-black text-slate-900">{user.firstname} {user.name}</h2>
                            <p className="text-cdr-blue font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-green-500" /> Compte Certifié Bomoko
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <section>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">À propos</h4>
                                <p className="text-slate-600 leading-relaxed font-medium italic">"{user.bio || "Jeune leader passionné par le développement durable."}"</p>
                            </section>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Résidence</p>
                                    <p className="font-bold text-slate-800 flex items-center gap-2"><MapPin size={14} className="text-cdr-red" /> {user.location || "Congo"}</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Contact</p>
                                    <p className="font-bold text-slate-800 truncate">{user.phone || user.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <button onClick={() => navigate('/settings')} className="w-full py-4 bg-cdr-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"><Settings size={18} /> Éditer mon profil</button>
                             <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 text-center">
                                 <p className="text-3xl font-black text-cdr-blue">48</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Visites du profil</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* TAB 3: MON CONTENU */}
        {activeTab === 'my-content' && (
          <div className="max-w-6xl mx-auto animate-fadeIn">
            <header className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Mon Contenu</h2>
                <p className="text-slate-500 font-medium">Gérez vos modules suivis et vos articles en vente.</p>
            </header>

            <div className="space-y-16">
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-cdr-blue/10 text-cdr-blue rounded-xl"><BookOpen size={24}/></div>
                        <h3 className="font-black text-2xl">Mes Formations ({enrolledTrainings.length})</h3>
                    </div>
                    {isLoadingData ? <Loader2 className="animate-spin text-cdr-blue" /> : enrolledTrainings.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {enrolledTrainings.map(t => (
                                <div key={t.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all cursor-pointer" onClick={() => navigate(`/course/${t.id}`)}>
                                    <div className="h-40 overflow-hidden relative">
                                        <img src={t.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                        <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircle size={48} className="text-white" /></div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-black text-slate-900 group-hover:text-cdr-blue transition-colors line-clamp-1">{t.title}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Par {t.provider}</p>
                                        <div className="mt-4 flex items-center gap-2 text-cdr-blue font-black text-[10px] uppercase">Reprendre le cours <ArrowRight size={14}/></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucune formation active</p>
                            <Link to="/services/training" className="mt-4 text-cdr-blue font-black inline-block hover:underline">Découvrir le catalogue</Link>
                        </div>
                    )}
                </section>
            </div>
          </div>
        )}

        {/* TAB 4: ALERTS */}
        {activeTab === 'alerts' && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Flux Bomoko</h2>
                    <p className="text-slate-500 font-medium">Opportunités du réseau en temps réel.</p>
                </div>
                <button className="text-[10px] font-black text-cdr-blue uppercase tracking-widest hover:underline">Tout marquer comme lu</button>
            </header>

            <div className="space-y-4">
                {isLoadingData ? <div className="py-20 text-center"><Loader2 className="animate-spin text-cdr-blue mx-auto" /></div> : notifications.length > 0 ? (
                    notifications.map(n => (
                        <div key={n.id} onClick={() => n.link && navigate(n.link)} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-start gap-6 hover:border-cdr-blue transition-all group cursor-pointer">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${n.color}`}>
                                {n.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-black text-slate-900 text-lg truncate pr-4">{n.title}</h4>
                                    <span className="text-[10px] font-black text-slate-400 uppercase whitespace-nowrap flex items-center gap-1"><Clock size={12} /> {n.time}</span>
                                </div>
                                <p className="text-slate-500 font-medium leading-relaxed line-clamp-2">{n.desc}</p>
                                {n.link && (
                                    <div className="mt-4 flex items-center gap-2 text-cdr-blue font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Voir les détails <ArrowRight size={14} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-200">
                        <Bell size={64} className="mx-auto text-slate-100 mb-6" />
                        <h3 className="text-xl font-black text-slate-900">Tout est calme !</h3>
                        <p className="text-slate-400 font-medium">Vous n'avez pas de nouvelles alertes pour le moment.</p>
                    </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
