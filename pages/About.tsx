
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Target, Globe, ShieldCheck, 
  Building2, Loader2, Award, Users,
  Linkedin, X, Flame, Rocket, Fingerprint,
  ShoppingBag, Briefcase
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { User as UserType, UserRole } from '../types';

const About: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<UserType[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(true);
  const [activeTab, setActiveTab] = useState<'vision' | 'objectifs' | 'team' | 'partners'>('vision');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  // RÉCUPÉRATION DES PARTENAIRES RÉELS DEPUIS FIREBASE
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", UserRole.PARTNER));
        const querySnapshot = await getDocs(q);
        const list: UserType[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as UserType);
        });
        setPartners(list);
      } catch (error) {
        console.error("Erreur partenaires:", error);
      } finally {
        setIsLoadingPartners(false);
      }
    };
    fetchPartners();
  }, []);

  const coreTeam = [
    { 
        id: '1',
        name: "Arnaud Kabongo", 
        role: "Directeur Général", 
        bio: "Visionnaire de l'économie numérique souveraine en RDC.",
        longBio: "Arnaud est convaincu que le futur du Congo passe par son indépendance technologique. Il supervise la stratégie globale de Bomoko.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        socials: { linkedin: "#", email: "arnaud@bomoko.cd" }
    },
    { 
        id: '2',
        name: "Mireille Luvambo", 
        role: "Responsable Opérations", 
        bio: "Experte en stratégie d'employabilité et insertion socio-professionnelle.",
        longBio: "Mireille coordonne tous les partenariats stratégiques avec les entreprises pour garantir que chaque offre soit certifiée.",
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
        socials: { linkedin: "#" }
    }
  ];

  const tabs = [
    { id: 'vision', label: 'Notre Vision', icon: <Target size={18}/> },
    { id: 'objectifs', label: 'Le Site BOMOKO', icon: <Rocket size={18}/> },
    { id: 'team', label: "L'Équipe", icon: <Users size={18}/> },
    { id: 'partners', label: 'Nos Partenaires', icon: <Building2 size={18}/> }
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-cdr-blue selection:text-white pb-20">
      
      {/* HEADER PREMIUM */}
      <section className="bg-slate-950 text-white pt-32 pb-40 px-4 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-cdr-blue/20 rounded-full blur-[120px]"></div>
         
         <button onClick={() => navigate(-1)} className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition z-20 font-black uppercase text-[10px] tracking-widest group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Retour
         </button>

         <div className="max-w-4xl mx-auto relative z-10 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cdr-yellow text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                Unité • Travail • Progrès
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none uppercase">
                Bâtir le <span className="text-cdr-blue">Congo</span> <br/>numérique.
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium italic">
                "BOMOKO Jeunesse Congo est le catalyseur de la nouvelle économie congolaise."
            </p>
         </div>
      </section>

      {/* TABS STICKY */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center md:justify-start gap-2 md:gap-8 overflow-x-auto no-scrollbar">
                  {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-3 px-6 py-6 text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                            activeTab === tab.id ? 'text-cdr-blue' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tab.icon} {tab.label}
                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-cdr-blue rounded-full shadow-[0_-2px_10px_rgba(0,119,255,0.3)]"></div>}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
          
          {/* --- VISION --- */}
          {activeTab === 'vision' && (
              <div className="space-y-32 animate-fadeIn">
                  <section className="grid lg:grid-cols-2 gap-20 items-center">
                      <div className="space-y-10">
                          <div>
                              <span className="text-cdr-blue font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Manifeste</span>
                              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Connecter les points. <br/><span className="text-cdr-red">Réduire les écarts.</span></h2>
                          </div>
                          <p className="text-xl text-slate-500 leading-relaxed font-medium">
                              Bomoko est la réponse technologique aux défis de l'emploi en RDC. Nous connectons les talents aux opportunités.
                          </p>
                          <div className="grid sm:grid-cols-2 gap-6">
                              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:border-cdr-blue transition-all">
                                  <Globe className="text-cdr-blue mb-6" size={24}/>
                                  <h4 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">Souveraineté</h4>
                                  <p className="text-slate-400 text-xs font-medium italic">Une technologie pensée par et pour les Congolais.</p>
                              </div>
                              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:border-cdr-red transition-all">
                                  <ShieldCheck className="text-cdr-red mb-6" size={24}/>
                                  <h4 className="font-black text-slate-900 mb-2 uppercase text-xs tracking-widest">Confiance</h4>
                                  <p className="text-slate-400 text-xs font-medium italic">Profils certifiés et transactions sécurisées.</p>
                              </div>
                          </div>
                      </div>
                      <div className="relative">
                          <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000" alt="Vision" className="rounded-[4rem] shadow-2xl h-[600px] w-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                          <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white max-w-xs">
                                <Flame className="text-cdr-red mb-4" size={32} />
                                <p className="font-black text-slate-900 text-lg leading-tight italic">"L'unité est le socle de notre progrès."</p>
                          </div>
                      </div>
                  </section>
              </div>
          )}

          {/* --- OBJECTIFS --- */}
          {activeTab === 'objectifs' && (
              <div className="animate-fadeIn space-y-20">
                  <div className="text-center max-w-3xl mx-auto">
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">Le Site BOMOKO.</h2>
                      <p className="text-slate-500 font-medium text-lg italic">Notre plateforme concrétise les objectifs de l'association à travers 4 piliers :</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white flex flex-col justify-between group shadow-xl">
                          <Briefcase className="text-cdr-red mb-8 group-hover:scale-110 transition-transform" size={48} />
                          <div><h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Employabilité</h3><p className="text-slate-400 leading-relaxed font-medium italic">Centraliser les opportunités de carrière en RDC.</p></div>
                      </div>
                      <div className="bg-cdr-blue p-12 rounded-[3.5rem] text-white flex flex-col justify-between group shadow-xl">
                          <Award className="text-cdr-yellow mb-8 group-hover:scale-110 transition-transform" size={48} />
                          <div><h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Excellence</h3><p className="text-blue-100 leading-relaxed font-medium italic">Bomoko Academy offre des modules vidéos interactifs certifiants.</p></div>
                      </div>
                      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 flex flex-col justify-between group shadow-2xl">
                          <ShoppingBag className="text-cdr-green mb-8 group-hover:scale-110 transition-transform" size={48} />
                          <div><h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">KOOP Market</h3><p className="text-slate-500 leading-relaxed font-medium italic">Le marché communautaire sécurisé pour l'entrepreneuriat local.</p></div>
                      </div>
                      <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 flex flex-col justify-between group">
                          <Fingerprint className="text-cdr-blue mb-8 group-hover:scale-110 transition-transform" size={48} />
                          <div><h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Certification</h3><p className="text-slate-500 leading-relaxed font-medium italic">Délivrer une identité numérique professionnelle reconnue.</p></div>
                      </div>
                  </div>
              </div>
          )}

          {/* --- ÉQUIPE --- */}
          {activeTab === 'team' && (
              <div className="animate-fadeIn">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                      <div className="max-w-xl">
                          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6 uppercase">L'Équipe.</h2>
                          <p className="text-slate-500 font-medium text-lg leading-relaxed italic">Les experts dévoués qui pilotent le projet Bomoko.</p>
                      </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                      {coreTeam.map((member, i) => (
                          <div key={i} onClick={() => setSelectedMember(member)} className="bg-white p-6 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group cursor-pointer overflow-hidden">
                              <div className="relative mb-8 overflow-hidden rounded-[2.8rem] h-80 shadow-inner">
                                  <img src={member.img} alt={member.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-1000" />
                              </div>
                              <div className="px-4 pb-4">
                                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-cdr-blue transition-colors uppercase tracking-tighter">{member.name}</h3>
                                  <p className="text-cdr-blue font-black text-[10px] uppercase tracking-[0.2em] mb-6 mt-1">{member.role}</p>
                                  <p className="text-slate-500 text-sm font-medium leading-relaxed italic line-clamp-2">"{member.bio}"</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* --- PARTENAIRES FIREBASE (NOM + LOGO UNIQUEMENT) --- */}
          {activeTab === 'partners' && (
              <div className="animate-fadeIn">
                  <div className="text-center max-w-2xl mx-auto mb-20">
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-6 uppercase">Nos Partenaires.</h2>
                      <p className="text-slate-500 font-medium text-lg leading-relaxed italic">Structures officielles inscrites sur notre réseau Firebase.</p>
                  </div>

                  {isLoadingPartners ? (
                      <div className="flex flex-col items-center py-20">
                          <Loader2 className="animate-spin text-cdr-blue mb-4" size={48} />
                          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Interrogation Database...</p>
                      </div>
                  ) : partners.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                          {partners.map((p, idx) => (
                              <div key={idx} className="flex flex-col items-center group">
                                  <div className="w-32 h-32 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-center p-4 mb-4 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                                      <div className="absolute inset-0 bg-blue-50/5 group-hover:bg-transparent transition-colors"></div>
                                      {p.companyLogo ? (
                                          <img src={p.companyLogo} alt={p.companyName} className="w-full h-full object-contain relative z-10" />
                                      ) : (
                                          <div className="w-full h-full bg-slate-50 rounded-2xl flex items-center justify-center text-cdr-blue font-black text-3xl relative z-10">
                                              {(p.companyName || 'P').charAt(0)}
                                          </div>
                                      )}
                                  </div>
                                  <h4 className="font-black text-slate-900 text-xs text-center uppercase tracking-tighter truncate w-full px-2">
                                      {p.companyName}
                                  </h4>
                                  <div className="w-6 h-1 bg-cdr-yellow rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="text-center py-24 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
                          <Building2 size={64} className="mx-auto text-slate-200 mb-6" />
                          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Aucun partenaire public inscrit pour le moment.</p>
                      </div>
                  )}
              </div>
          )}
      </div>

      {/* MODAL ÉQUIPE */}
      {selectedMember && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedMember(null)}>
              <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden grid lg:grid-cols-12 animate-slideUp" onClick={(e) => e.stopPropagation()}>
                  <div className="lg:col-span-5 bg-slate-100 relative h-64 lg:h-full">
                      <img src={selectedMember.img} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="lg:col-span-7 p-10 md:p-16 flex flex-col justify-center relative">
                      <button onClick={() => setSelectedMember(null)} className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-full transition text-slate-400"><X size={32}/></button>
                      <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 leading-none uppercase">{selectedMember.name}</h2>
                      <p className="text-lg font-black text-cdr-blue uppercase tracking-widest mb-10">{selectedMember.role}</p>
                      <p className="text-slate-500 leading-relaxed text-lg italic mb-10">"{selectedMember.longBio}"</p>
                      <div className="flex gap-4">
                          <a href={`mailto:${selectedMember.socials.email || 'contact@bomoko.cd'}`} className="flex items-center gap-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-8 rounded-2xl shadow-xl hover:bg-black transition-all">Contact Direct</a>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* FOOTER */}
      <div className="py-20 text-center border-t border-slate-100 bg-slate-50">
          <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-[10px]">BOMOKO JEUNESSE CONGO • 2024</p>
      </div>
    </div>
  );
};

export default About;
