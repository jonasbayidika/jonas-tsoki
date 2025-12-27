
import React, { useState, useEffect, useMemo } from 'react';
import { Training, UserRole } from '../types';
import { 
    Clock, Award, X, CheckCircle, Calendar, 
    ArrowLeft, BookOpen, User, 
    ChevronRight, Play, Smartphone, AlertCircle, Search,
    PlusCircle, Loader2, TrendingUp, Users, ExternalLink,
    Video, DollarSign, BarChart3, Sparkles, Youtube, Info, Trash2, Edit3,
    Maximize2, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import PaymentModal from '../components/PaymentModal';

const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, enrollInCourse, createCourse, updateCourse, deleteCourse } = useAuth();
  
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');

  // Modal Ajout/Modification Cours
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal Lecteur Vidéo Interactif
  const [videoModalData, setVideoModalData] = useState<Training | null>(null);

  const initialCourseState = {
    title: '',
    category: 'Business',
    price: '',
    duration: '',
    format: 'Vidéo Intégrée',
    description: '',
    videoUrl: '', 
    sourceUrl: '',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
  };

  const [courseFormData, setCourseFormData] = useState(initialCourseState);
  const categories = ['Tous', 'Business', 'Tech', 'Marketing', 'Agriculture', 'Soft Skills'];

  const instructorStats = useMemo(() => {
    if (!user || user.role !== UserRole.FORMATEUR) return { participants: 0, revenue: 0 };
    const myCourses = trainings.filter(t => t.instructorId === user.id);
    return myCourses.reduce((acc, curr) => ({
      participants: acc.participants + (curr.participantsCount || 0),
      revenue: acc.revenue + (curr.totalRevenue || 0)
    }), { participants: 0, revenue: 0 });
  }, [trainings, user]);

  const fetchTrainings = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "trainings"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: Training[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Training);
      });
      setTrainings(fetched);
    } catch (error) {
      console.error("Firebase Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCourseId(null);
    setCourseFormData(initialCourseState);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (course: Training, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCourseId(course.id);
    setCourseFormData({
      title: course.title || '',
      category: course.category || 'Business',
      price: course.price || '',
      duration: course.duration || '',
      format: course.format || 'Vidéo Intégrée',
      description: course.description || '',
      videoUrl: course.videoUrl || '',
      sourceUrl: course.sourceUrl || '',
      image: course.image || initialCourseState.image
    });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCourseId) {
        await updateCourse(editingCourseId, courseFormData);
      } else {
        await createCourse(courseFormData);
      }
      setIsAddModalOpen(false);
      fetchTrainings();
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'opération.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("🔴 ACTION IRRÉVERSIBLE\nSouhaitez-vous supprimer définitivement cette formation ?")) {
      try {
        await deleteCourse(courseId);
        fetchTrainings();
      } catch (error: any) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const filteredTrainings = trainings.filter(t => {
      const matchesSearch = (t.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = activeCategory === 'Tous' || t.category === activeCategory;
      return matchesSearch && matchesCat;
  });

  const handleAccessRequest = (course: Training) => {
      if (!user) { navigate('/login'); return; }
      const isOwner = user.id === course.instructorId;
      const isFree = course.price?.toLowerCase().includes('gratuit');
      const hasPaid = user.enrolledCourses?.includes(course.id);
      
      if (isOwner || isFree || hasPaid) { 
          // Ouvrir le lecteur modal au lieu de naviguer
          setVideoModalData(course);
      } else { 
          setSelectedTraining(course); 
          setIsPaymentOpen(true); 
      }
  };

  // Helper pour YouTube
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cdr-blue transition mb-8 font-bold"><ArrowLeft size={20} /> Retour</button>

        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">Centre de Formation</h1>
            <p className="text-slate-600 mt-4 font-medium text-lg italic">Académie numérique d'excellence en RDC.</p>
          </div>
          
          {user?.role === UserRole.FORMATEUR && (
            <button 
              onClick={handleOpenAddModal}
              className="px-8 py-4 bg-cdr-blue text-white font-black rounded-2xl hover:bg-blue-700 transition flex items-center gap-3 shadow-xl transform active:scale-95"
            >
              <PlusCircle size={22} /> Nouveau Cours
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input type="text" placeholder="Trouver une formation..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {categories.map(c => (
                        <button key={c} onClick={() => setActiveCategory(c)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === c ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{c}</button>
                    ))}
                </div>
            </div>
        </div>

        {isLoading ? (
            <div className="py-20 text-center">
                <Loader2 className="animate-spin text-cdr-blue mx-auto mb-4" size={48} />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Chargement...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTrainings.map((course) => {
                    const isOwner = user?.id === course.instructorId;
                    const hasAccess = isOwner || user?.enrolledCourses?.includes(course.id) || course.price?.toLowerCase().includes('gratuit');
                    
                    return (
                        <div key={course.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col relative">
                            <div className="h-56 overflow-hidden relative">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 right-4 bg-white px-4 py-1.5 rounded-xl text-cdr-blue text-[10px] font-black shadow-lg uppercase">{course.price}</div>
                                
                                {isOwner && (
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        <div className="bg-slate-900 text-white text-[8px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg uppercase tracking-tighter">
                                            <BarChart3 size={10} /> PROPRIÉTAIRE
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                              onClick={(e) => handleOpenEditModal(course, e)}
                                              className="w-10 h-10 bg-white text-cdr-blue rounded-xl flex items-center justify-center shadow-xl hover:bg-blue-50 transition transform hover:scale-110"
                                            >
                                              <Edit3 size={18} />
                                            </button>
                                            <button 
                                              onClick={(e) => handleDelete(course.id, e)}
                                              className="w-10 h-10 bg-white text-red-600 rounded-xl flex items-center justify-center shadow-xl hover:bg-red-50 transition transform hover:scale-110"
                                            >
                                              <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                    <Clock size={12} className="text-cdr-blue" /> {course.duration} • <BookOpen size={12} className="text-cdr-blue" /> {course.category}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-cdr-blue transition-colors leading-tight">{course.title}</h3>
                                
                                {isOwner && (
                                    <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="text-center">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Élèves</p>
                                            <p className="text-lg font-black text-cdr-blue">{course.participantsCount || 0}</p>
                                        </div>
                                        <div className="text-center border-l border-slate-200">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Gain</p>
                                            <p className="text-lg font-black text-cdr-green">{course.totalRevenue || 0}$</p>
                                        </div>
                                    </div>
                                )}

                                <button onClick={() => handleAccessRequest(course)} className={`mt-auto w-full py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all ${hasAccess ? 'bg-slate-900 text-white hover:bg-black' : 'bg-cdr-blue text-white hover:bg-blue-700'}`}>
                                    {hasAccess ? <><Play size={18} /> {isOwner ? 'Ouvrir la session' : 'Rejoindre la vidéo'}</> : <><Smartphone size={18} /> Débloquer le cours</>}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {/* --- MODAL LECTEUR VIDÉO INTERACTIF --- */}
      {videoModalData && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fadeIn" onClick={() => setVideoModalData(null)}>
              <div className="w-full max-w-5xl bg-black rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/10 animate-slideUp" onClick={(e) => e.stopPropagation()}>
                  <div className="absolute top-6 right-6 z-10 flex gap-3">
                      <button 
                        onClick={() => navigate(`/course/${videoModalData.id}`)}
                        className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition backdrop-blur-md"
                        title="Plein écran dédié"
                      >
                          <Maximize2 size={24} />
                      </button>
                      <button 
                        onClick={() => setVideoModalData(null)}
                        className="bg-white/10 hover:bg-cdr-red text-white p-3 rounded-full transition backdrop-blur-md"
                      >
                          <X size={24} />
                      </button>
                  </div>
                  
                  <div className="aspect-video w-full bg-slate-900 flex items-center justify-center">
                      {videoModalData.videoUrl ? (
                          <>
                              {getYoutubeId(videoModalData.videoUrl) ? (
                                  <iframe 
                                    src={`https://www.youtube.com/embed/${getYoutubeId(videoModalData.videoUrl)}?autoplay=1&rel=0&modestbranding=1`}
                                    className="w-full h-full" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    title={videoModalData.title}
                                  ></iframe>
                              ) : (
                                  <video controls autoPlay className="w-full h-full object-contain">
                                      <source src={videoModalData.videoUrl} type="video/mp4" />
                                      Votre navigateur ne supporte pas ce format vidéo.
                                  </video>
                              )}
                          </>
                      ) : (
                          <div className="text-center p-12">
                              <AlertCircle size={48} className="text-slate-600 mx-auto mb-4" />
                              <p className="text-slate-400 font-bold">Aucun flux vidéo trouvé pour ce cours.</p>
                          </div>
                      )}
                  </div>

                  <div className="bg-slate-900 p-8 text-white">
                      <div className="flex justify-between items-center">
                          <div>
                              <h3 className="text-2xl font-black tracking-tight">{videoModalData.title}</h3>
                              <p className="text-slate-400 text-sm mt-1">Par {videoModalData.provider} • {videoModalData.duration}</p>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                             <ShieldCheck className="text-cdr-blue" size={16} />
                             <span className="text-[10px] font-black uppercase">Vérifié Bomoko</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* MODAL CRÉATION / MODIFICATION COURS */}
      {isAddModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-fadeIn">
              <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col animate-slideUp">
                  <div className="bg-cdr-blue p-8 text-white flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-4">
                          <Video size={24} />
                          <h2 className="text-2xl font-black">{editingCourseId ? 'Éditer la formation' : 'Nouveau module vidéo'}</h2>
                      </div>
                      <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition"><X size={28} /></button>
                  </div>
                  <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-10 space-y-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre de la formation</label>
                            <input required type="text" value={courseFormData.title} onChange={e => setCourseFormData({...courseFormData, title: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Catégorie</label>
                            <select value={courseFormData.category} onChange={e => setCourseFormData({...courseFormData, category: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold">{categories.filter(c => c !== 'Tous').map(c => <option key={c} value={c}>{c}</option>)}</select>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prix (ex: 10$ ou Gratuit)</label>
                            <input required type="text" value={courseFormData.price} onChange={e => setCourseFormData({...courseFormData, price: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Durée (ex: 1h 45min)</label>
                            <input required type="text" value={courseFormData.duration} onChange={e => setCourseFormData({...courseFormData, duration: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                        </div>
                      </div>

                      <div className="p-8 bg-slate-900 rounded-[2rem] space-y-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <Youtube className="text-cdr-red" size={24} />
                            <h3 className="font-black text-lg">Source Vidéo (Directe ou YouTube)</h3>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">URL Vidéo</label>
                            <input required type="url" value={courseFormData.videoUrl} onChange={e => setCourseFormData({...courseFormData, videoUrl: e.target.value})} className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-xl outline-none text-white font-bold" placeholder="https://youtube.com/watch?v=... ou lien .mp4" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description & Objectifs</label>
                        <textarea required rows={4} value={courseFormData.description} onChange={e => setCourseFormData({...courseFormData, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium resize-none"></textarea>
                      </div>
                      
                      <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-cdr-blue text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl flex items-center justify-center gap-3">
                          {isSubmitting ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20} /> {editingCourseId ? 'Mettre à jour' : 'Publier sur Bomoko Academy'}</>}
                      </button>
                  </form>
              </div>
          </div>
      )}

      {selectedTraining && (
          <PaymentModal 
            isOpen={isPaymentOpen}
            onClose={() => setIsPaymentOpen(false)}
            onSuccess={() => { enrollInCourse(selectedTraining.id); setIsPaymentOpen(false); setVideoModalData(selectedTraining); }}
            itemName={selectedTraining.title}
            itemPrice={selectedTraining.price}
          />
      )}
    </div>
  );
};

export default TrainingPage;
