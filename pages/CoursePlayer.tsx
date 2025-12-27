
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Menu, ShieldCheck, Loader2, User, Video, ExternalLink,
  BarChart3, Users, DollarSign, TrendingUp, Sparkles, FileText, Info,
  PlayCircle, Youtube
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Training } from '../types';

const CoursePlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [courseData, setCourseData] = useState<Training | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'stats'>('overview');

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const docRef = doc(db, "trainings", courseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourseData({ id: docSnap.id, ...docSnap.data() } as Training);
        }
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Extraction intelligente de l'ID YouTube
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderVideoPlayer = () => {
    if (!courseData?.videoUrl) {
      return (
        <div className="text-center p-20 bg-slate-900 w-full h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Video size={40} className="text-slate-600" />
            </div>
            <h3 className="text-white text-xl font-black mb-2 uppercase tracking-tighter">Flux vidéo indisponible</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">L'instructeur doit configurer le lien vidéo dans son bureau.</p>
        </div>
      );
    }

    const url = courseData.videoUrl;
    const ytId = getYoutubeId(url);
    
    // Rendu YouTube (Format que vous avez demandé)
    if (ytId) {
      return (
        <iframe 
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
          className="w-full h-full border-0 shadow-2xl" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          title={courseData.title}
        ></iframe>
      );
    }

    // Rendu Vimeo
    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('/').pop();
      return (
        <iframe 
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
          className="w-full h-full border-0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowFullScreen
        ></iframe>
      );
    }

    // Rendu Direct (MP4)
    return (
      <video controls autoPlay className="w-full h-full bg-black object-contain shadow-2xl">
        <source src={url} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-cdr-blue animate-spin mb-4" />
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">Initialisation du lecteur...</p>
      </div>
    );
  }

  if (!courseData) return <div className="text-white text-center py-20 bg-slate-900 h-screen font-black uppercase tracking-widest flex items-center justify-center">Module de cours introuvable</div>;

  const isInstructor = user?.id === courseData.instructorId;

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-sans">
      {/* SIDEBAR CURRICULUM */}
      <aside className={`bg-white border-r border-slate-200 flex-shrink-0 transition-all duration-500 absolute md:relative z-30 h-full flex flex-col ${sidebarOpen ? 'w-85 translate-x-0 shadow-2xl md:shadow-none' : 'w-0 -translate-x-full md:w-0'}`}>
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-cdr-blue text-white rounded-lg"><PlayCircle size={18} /></div>
                <h2 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em]">Curriculum</h2>
            </div>
            {isInstructor && <span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-1 rounded-md uppercase border border-green-200">Mode Admin</span>}
        </div>
        <div className="flex-1 overflow-y-auto">
            <button className="w-full flex items-start gap-4 p-6 text-left bg-blue-50/80 border-b border-blue-100 group transition-all">
                <div className="mt-1 w-7 h-7 bg-cdr-blue text-white rounded-xl flex items-center justify-center text-[11px] font-black group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">1</div>
                <div>
                    <div className="text-[13px] font-black text-slate-900">Module Principal</div>
                    <div className="text-[9px] text-cdr-blue font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                        <Youtube size={10} /> Vidéo {courseData.duration}
                    </div>
                </div>
            </button>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50/80">
             <button onClick={() => navigate('/services/training')} className="w-full py-4 border-2 border-slate-200 rounded-2xl text-slate-500 text-[10px] font-black hover:bg-white hover:text-cdr-blue hover:border-cdr-blue transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-sm active:scale-95">
                <ChevronLeft size={16} /> Quitter le cours
             </button>
        </div>
      </aside>

      {/* ZONE LECTEUR PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* HEADER MINI */}
        <div className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-20 shrink-0">
             <div className="flex items-center gap-6 text-white min-w-0">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition flex items-center gap-2">
                    <Menu size={20} />
                    {!sidebarOpen && <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Afficher Menu</span>}
                </button>
                <div className="flex flex-col min-w-0 border-l border-white/10 pl-6">
                    <span className="font-black text-[11px] uppercase tracking-[0.15em] truncate text-slate-100">{courseData.title}</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
                        <User size={10} className="text-cdr-blue" /> {courseData.provider}
                    </span>
                </div>
             </div>
             <div className="hidden sm:flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                    <ShieldCheck size={14} className="text-cdr-blue" />
                    <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">Bomoko Certified</span>
                </div>
             </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50">
            {/* PANNEAU STATS FORMATEUR */}
            {isInstructor && (
                <div className="bg-slate-900 border-b border-white/5 px-8 py-5 animate-fadeIn relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp size={80} className="text-white" />
                    </div>
                    <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-3 text-cdr-blue">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                <BarChart3 size={20} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Dashboard Instructeur</span>
                        </div>
                        <div className="flex gap-10">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-cdr-blue animate-pulse"></div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inscrits</p>
                                    <p className="text-lg font-black text-white">{courseData.participantsCount || 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <div className="text-left">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Recettes</p>
                                    <p className="text-lg font-black text-white">{courseData.totalRevenue || 0}$</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* LECTEUR VIDÉO (UTILISE VOTRE FORMAT IFRAME) */}
            <div className="bg-black w-full aspect-video flex items-center justify-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 z-10 pointer-events-none border-b-4 border-cdr-blue/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {renderVideoPlayer()}
            </div>

            <div className="max-w-6xl mx-auto w-full px-8 py-14">
                <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-blue-50 text-cdr-blue rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">{courseData.category || "Formation"}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1"><Info size={12} /> Dernière mise à jour le 20/05/2024</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">{courseData.title}</h1>
                        <div className="flex items-center gap-2 text-slate-500 font-bold">
                            <ShieldCheck size={18} className="text-green-500" /> 
                            <span className="text-sm">Expertise validée par Bomoko Academy Congo</span>
                        </div>
                    </div>
                    {courseData.sourceUrl && (
                        <a href={courseData.sourceUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white border border-slate-200 rounded-[2rem] flex items-center gap-3 text-slate-800 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition shadow-sm hover:shadow-md transform active:scale-95 shrink-0">
                            <ExternalLink size={18} className="text-cdr-blue" /> Site Source Externe
                        </a>
                    )}
                </div>

                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="flex border-b border-slate-50 bg-slate-50/30">
                        {[
                            {id: 'overview', label: 'Description', icon: <FileText size={16}/>},
                            {id: 'resources', label: 'Documents', icon: <FileText size={16}/>},
                            isInstructor && {id: 'stats', label: 'Analytics Pro', icon: <TrendingUp size={16} className="text-green-600"/>}
                        ].filter(Boolean).map((tab: any) => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)} 
                                className={`px-10 py-7 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative flex items-center gap-3 ${activeTab === tab.id ? 'text-cdr-blue' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab.icon} {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-8 right-8 h-1 bg-cdr-blue rounded-full shadow-[0_-2px_10px_rgba(0,119,255,0.4)]"></div>}
                            </button>
                        ))}
                    </div>
                    
                    <div className="p-12">
                        {activeTab === 'overview' && (
                            <div className="animate-fadeIn">
                                <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <Sparkles size={20} className="text-cdr-yellow" /> À propos de ce module
                                </h4>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 font-medium leading-relaxed text-lg italic bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 border-dashed">
                                        "{courseData.description || "L'instructeur n'a pas encore ajouté de résumé pour cette session."}"
                                    </p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'resources' && (
                            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 animate-fadeIn">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <FileText size={40} className="text-slate-200" />
                                </div>
                                <h4 className="text-slate-800 font-black text-lg">Aucun document joint</h4>
                                <p className="text-slate-400 text-sm mt-1 uppercase font-bold tracking-widest">Téléchargements bientôt disponibles</p>
                            </div>
                        )}
                        {activeTab === 'stats' && isInstructor && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-10 bg-blue-50/50 rounded-[3rem] border border-blue-100 group hover:bg-blue-50 transition-colors">
                                        <Users className="text-cdr-blue mb-4" size={32} />
                                        <div className="text-4xl font-black text-slate-900 mb-1">{courseData.participantsCount || 0}</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Élèves ayant complété 100%</div>
                                    </div>
                                    <div className="p-10 bg-green-50/50 rounded-[3rem] border border-green-100 group hover:bg-green-50 transition-colors">
                                        <DollarSign className="text-green-600 mb-4" size={32} />
                                        <div className="text-4xl font-black text-slate-900 mb-1">{courseData.totalRevenue || 0}$</div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ventes directes enregistrées</div>
                                    </div>
                                </div>
                                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center gap-6 shadow-2xl">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                                        <Info size={24} className="text-cdr-yellow" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Contrôle de conformité</p>
                                        <p className="text-xs text-slate-400 mt-1">Ces données sont générées par les transactions mobiles validées. Pour toute réclamation, contactez le support agent de Bomoko.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePlayer;
