
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Briefcase, GraduationCap, Users, 
  ShoppingBag, Star, Heart, 
  Loader2, MessageSquare, LayoutDashboard, 
  CheckCircle2, Sparkles, Zap, ShieldCheck, 
  PlayCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Job, Training, Classified } from '../types';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [featuredJob, setFeaturedJob] = useState<Job | null>(null);
  const [featuredTraining, setFeaturedTraining] = useState<Training | null>(null);
  const [featuredKoop, setFeaturedKoop] = useState<Classified | null>(null);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const jobsQ = query(collection(db, "jobs"), orderBy("createdAt", "desc"), limit(1));
        const trainingsQ = query(collection(db, "trainings"), orderBy("createdAt", "desc"), limit(1));
        const koopQ = query(collection(db, "koop"), orderBy("date", "desc"), limit(1));

        const [jobsSnap, trainingsSnap, koopSnap] = await Promise.all([
          getDocs(jobsQ),
          getDocs(trainingsQ),
          getDocs(koopQ)
        ]);

        if (!jobsSnap.empty) setFeaturedJob({ id: jobsSnap.docs[0].id, ...jobsSnap.docs[0].data() } as Job);
        if (!trainingsSnap.empty) setFeaturedTraining({ id: trainingsSnap.docs[0].id, ...trainingsSnap.docs[0].data() } as Training);
        if (!koopSnap.empty) setFeaturedKoop({ id: koopSnap.docs[0].id, ...koopSnap.docs[0].data() } as Classified);
      } catch (error) {
        console.error("Error fetching featured content:", error);
      } finally {
        setIsLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* --- 1. HERO SECTION (PHOTO 2) --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-10 animate-fadeIn">
                <div className="inline-flex items-center gap-2 bg-slate-100/50 border border-slate-200/50 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    LE FUTUR DE LA RDC EST ICI
                </div>

                <h1 className="text-6xl md:text-[5.5rem] font-black text-slate-900 tracking-tighter leading-[0.9] uppercase">
                    L'avenir se <br/> construit <br/>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cdr-blue via-cdr-red to-cdr-red">ENSEMBLE.</span>
                </h1>

                <p className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed">
                    BOMOKO connecte la jeunesse congolaise aux opportunités d'emploi, de formation et d'entrepreneuriat.
                </p>

                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                        className="group px-10 py-5 bg-[#0F172A] text-white font-black rounded-[1.5rem] hover:bg-black transition-all flex items-center gap-4 shadow-2xl active:scale-95 text-sm uppercase tracking-tight"
                    >
                        {isAuthenticated ? 'Accéder au Dashboard' : 'Commencer l\'aventure'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Cartes flottantes (PHOTO 2) */}
            <div className="relative h-[550px] hidden lg:flex items-center justify-center">
                {/* Carte Premium */}
                <div className="absolute top-10 left-0 bg-white p-8 rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-slate-50 w-72 animate-blob z-20">
                    <div className="w-12 h-12 bg-blue-50 text-cdr-blue rounded-2xl flex items-center justify-center mb-6">
                        <Star className="fill-current" size={24} />
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PREMIUM</div>
                    <div className="text-4xl font-black text-slate-900 tracking-tighter">18k+</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Membres actifs</div>
                </div>

                {/* Carte Certifié */}
                <div className="absolute top-32 right-0 bg-cdr-blue p-12 rounded-[3.2rem] shadow-[0_32px_64px_-15px_rgba(0,119,255,0.3)] text-white w-80 animate-blob [animation-delay:2s] z-10">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-12 backdrop-blur-md">
                        <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter">Certifié</h3>
                </div>

                {/* Carte Instantané */}
                <div className="absolute bottom-10 left-20 bg-[#0F172A] p-12 rounded-[3.2rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] text-white w-80 animate-blob [animation-delay:4s] z-30">
                    <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-12 shadow-xl shadow-yellow-400/20">
                        <Zap className="text-slate-950 fill-current" size={28} />
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter">Instantané</h3>
                </div>
            </div>
        </div>
      </section>

      {/* --- 2. SECTION À LA UNE (PHOTO 3) --- */}
      <section className="py-24 px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
                <div>
                    <h2 className="text-[2.8rem] font-black text-slate-900 tracking-tighter leading-none">À la une sur Bomoko</h2>
                    <p className="text-slate-500 font-medium mt-4 text-lg italic">Les dernières opportunités du réseau en temps réel.</p>
                </div>
                <Link to="/services" className="text-cdr-blue font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-2 hover:translate-x-1 transition-transform group">
                    VOIR TOUT LE CATALOGUE <ArrowRight size={18} className="text-cdr-blue" />
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Emploi Card */}
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col min-h-[380px] group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-12">
                        <div className="w-16 h-16 bg-red-50 text-cdr-red rounded-2xl flex items-center justify-center shadow-inner"><Briefcase size={32} /></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EMPLOI RÉCENT</span>
                    </div>
                    {isLoadingFeatured ? <Loader2 className="animate-spin text-slate-200" /> : (
                        <>
                            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{featuredJob?.title || "Aucune offre publiée."}</h3>
                            <p className="text-slate-400 font-medium italic mt-2">Aucune offre publiée.</p>
                        </>
                    )}
                </div>

                {/* Training Card (Bouton Bleu de la Photo 3) */}
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col min-h-[380px] group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-12">
                        <div className="w-16 h-16 bg-blue-50 text-cdr-blue rounded-2xl flex items-center justify-center shadow-inner"><GraduationCap size={32} /></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">COURS FLASH</span>
                    </div>
                    {isLoadingFeatured ? <Loader2 className="animate-spin text-slate-200" /> : (
                        <>
                            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">AI</h3>
                            <p className="text-slate-500 font-bold mb-8 italic">Par merveille merv • 10</p>
                            <button onClick={() => navigate('/services/training')} className="mt-auto px-8 py-5 bg-cdr-blue text-white rounded-[1.2rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">DÉCOUVRIR LE COURS</button>
                        </>
                    )}
                </div>

                {/* Koop Card */}
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col min-h-[380px] group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-12">
                        <div className="w-16 h-16 bg-yellow-50 text-cdr-yellow rounded-2xl flex items-center justify-center shadow-inner"><ShoppingBag size={32} /></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KOOP MARKET</span>
                    </div>
                    <p className="text-slate-400 font-medium italic mt-2">Aucun article en vente.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- 3. ÉCOSYSTÈME BENTO (PHOTO 4 & 5) --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="mb-20">
                <span className="text-cdr-blue font-black uppercase tracking-[0.4em] text-[10px] flex items-center gap-2 mb-6">
                    <Sparkles size={14} /> ÉCOSYSTÈME
                </span>
                <h2 className="text-6xl md:text-[5rem] font-black text-slate-900 tracking-tighter leading-[0.9]">
                    Tout ce dont vous <br/> avez besoin.
                </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10">
                {/* Formation Large (Photo 4) */}
                <div className="lg:col-span-8 bg-[#EEF2FF] p-16 rounded-[4rem] flex flex-col justify-between group relative overflow-hidden h-[450px]">
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none group-hover:scale-105 transition-transform duration-[5s]">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-cdr-blue text-white rounded-[1.8rem] flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/30"><GraduationCap size={40}/></div>
                        <h3 className="text-[2.8rem] font-black text-slate-900 mb-4 tracking-tighter">Formation & E-Learning</h3>
                        <p className="text-slate-500 font-medium text-lg max-w-md leading-relaxed mb-10">Boostez votre carrière avec des cours locaux certifiants.</p>
                    </div>
                    <Link to="/services/training" className="relative z-10 flex items-center gap-4 text-cdr-blue font-black text-[13px] uppercase tracking-[0.2em] hover:gap-6 transition-all">EXPLORER LE CATALOGUE <ArrowRight size={22}/></Link>
                </div>

                {/* Emploi Vertical (Photo 4) */}
                <div className="lg:col-span-4 bg-[#FFF1F2] p-16 rounded-[4rem] flex flex-col justify-between group relative overflow-hidden h-[450px]">
                     <div className="relative z-10">
                        <div className="w-20 h-20 bg-cdr-red text-white rounded-[1.8rem] flex items-center justify-center mb-10 shadow-2xl shadow-red-500/20"><Briefcase size={40}/></div>
                        <h3 className="text-[2.8rem] font-black text-slate-900 mb-4 tracking-tighter leading-[1.1]">Emploi & Stages</h3>
                     </div>
                     <Link to="/jobs" className="relative z-10 flex items-center gap-4 text-cdr-red font-black text-[13px] uppercase tracking-[0.2em] hover:gap-6 transition-all">POSTULER <ArrowRight size={22}/></Link>
                </div>

                {/* KOOP Market (Photo 5) */}
                <div className="lg:col-span-4 bg-[#FEFCE8] p-16 rounded-[4rem] flex flex-col justify-between group relative overflow-hidden h-[450px]">
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-cdr-yellow text-slate-900 rounded-[1.8rem] flex items-center justify-center mb-10 shadow-2xl shadow-yellow-500/20"><ShoppingBag size={40}/></div>
                        <h3 className="text-[2.8rem] font-black text-slate-900 mb-4 tracking-tighter leading-[1.1]">KOOP Market</h3>
                    </div>
                    <Link to="/koop" className="relative z-10 flex items-center gap-4 text-yellow-600 font-black text-[13px] uppercase tracking-[0.2em] hover:gap-6 transition-all">VENDRE/ACHETER <ArrowRight size={22}/></Link>
                </div>

                {/* Communautés Large (Photo 5) */}
                <div className="lg:col-span-8 bg-[#0F172A] p-16 rounded-[4rem] flex flex-col justify-between group relative overflow-hidden h-[450px]">
                    <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-cdr-blue/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-white/10 text-white rounded-[1.8rem] flex items-center justify-center mb-10 border border-white/10 backdrop-blur-sm"><Users size={40}/></div>
                        <h3 className="text-[2.8rem] font-black text-white mb-4 tracking-tighter">Communautés & Clubs</h3>
                    </div>
                    <Link to="/communities" className="relative z-10 flex items-center gap-4 text-cdr-blue font-black text-[13px] uppercase tracking-[0.2em] hover:gap-6 transition-all">REJOINDRE UN CLUB <ArrowRight size={22}/></Link>
                </div>
            </div>
        </div>
      </section>

      {/* --- 4. SECTION BIENVENUE (PHOTO 6) --- */}
      {isAuthenticated && (
          <section className="py-20 px-6">
              <div className="max-w-7xl mx-auto bg-[#0F172A] rounded-[4.5rem] p-20 md:p-24 text-center text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cdr-blue/5 rounded-full blur-[120px]"></div>
                  <div className="relative z-10">
                      <h2 className="text-[3.5rem] md:text-[5.5rem] font-black tracking-tighter mb-6 uppercase leading-none">Bienvenue, {user?.firstname} !</h2>
                      <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto italic mb-20 leading-relaxed opacity-80">Votre écosystème Bomoko est prêt. Accédez rapidement à vos outils.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                          <Link to="/dashboard" className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/10 transition-all flex flex-col items-center gap-6 group">
                              <div className="w-16 h-16 bg-cdr-blue rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20"><LayoutDashboard size={32}/></div>
                              <span className="text-[12px] font-black uppercase tracking-[0.3em]">DASHBOARD</span>
                          </Link>
                          <Link to="/messages" className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/10 transition-all flex flex-col items-center gap-6 group">
                              <div className="w-16 h-16 bg-cdr-red rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/20"><MessageSquare size={32}/></div>
                              <span className="text-[12px] font-black uppercase tracking-[0.3em]">MESSAGES</span>
                          </Link>
                          <Link to="/koop" className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 hover:bg-white/10 transition-all flex flex-col items-center gap-6 group">
                              <div className="w-16 h-16 bg-cdr-yellow rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/20"><ShoppingBag className="text-slate-900" size={32}/></div>
                              <span className="text-[12px] font-black uppercase tracking-[0.3em]">MARKETPLACE</span>
                          </Link>
                      </div>
                  </div>
              </div>
          </section>
      )}

      {/* --- 5. SECTION AVIS (PHOTO 1 & 7) --- */}
      <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
              <div className="bg-[#0F172A] rounded-[4.5rem] p-16 md:p-32 text-center text-white relative overflow-hidden group">
                  {/* Étoile décorative en fond (Photo 1) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none scale-[1.8] transition-transform duration-[30s] group-hover:rotate-45">
                      <Star size={500} className="fill-current" />
                  </div>
                  
                  <div className="relative z-10 space-y-10">
                      <h2 className="text-[3.5rem] md:text-[5.5rem] font-black tracking-tighter leading-[0.9] uppercase">Votre avis <br/> nous fait grandir</h2>
                      <p className="text-slate-400 font-medium text-xl max-w-xl mx-auto leading-relaxed">Partagez votre expérience Bomoko avec la communauté congolaise.</p>
                      
                      <div className="pt-6">
                          <Link to="/avis" className="inline-flex items-center gap-5 px-14 py-7 bg-cdr-blue text-white font-black rounded-full hover:bg-blue-600 transition-all shadow-[0_20px_40px_-10px_rgba(0,119,255,0.4)] text-sm uppercase tracking-[0.2em] active:scale-95">
                              Laisser un témoignage <Sparkles size={20} />
                          </Link>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* FOOTER SIGNATURE (PHOTO 1) */}
      <div className="py-24 text-center bg-white border-t border-slate-50">
          <div className="flex flex-col items-center gap-10">
              <div className="flex items-center justify-center gap-10">
                 <CheckCircle2 size={32} className="text-green-500 opacity-80" />
                 <ShieldCheck size={32} className="text-cdr-blue opacity-80" />
                 <Heart size={32} className="text-cdr-red fill-current opacity-80" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.6em] text-[11px] flex items-center gap-3">
                  <Heart size={14} className="text-cdr-red fill-current" /> MADE WITH PASSION IN KINSHASA
              </p>
          </div>
      </div>
      
    </div>
  );
};

export default Home;
