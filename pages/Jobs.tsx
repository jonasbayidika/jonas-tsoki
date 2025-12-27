
import React, { useState, useEffect } from 'react';
import { Job, UserRole } from '../types';
import { 
  MapPin, Briefcase, Search, X, CheckCircle, 
  Send, ArrowLeft, Loader2, Target, PlusCircle, AlertCircle, Building2, Calendar,
  FileText, Info, Upload, User, Mail, FileUp, Type, FileCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';

const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, createJob } = useAuth();
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Form States
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [isSubmittingApply, setIsSubmittingApply] = useState(false);
  const [coverLetterMode, setCoverLetterMode] = useState<'text' | 'file'>('text');

  const [newJob, setNewJob] = useState({
    title: '',
    location: 'Kinshasa',
    type: 'CDI',
    description: '',
    requirements: '',
    companyEmail: currentUser?.email || ''
  });

  const [applyData, setApplyData] = useState({
    candidateName: currentUser ? `${currentUser.firstname} ${currentUser.name}` : '',
    candidateEmail: currentUser?.email || '',
    cvFile: '', // Base64
    coverLetterText: '',
    coverLetterFile: '' // Base64
  });

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: any[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      setJobs(fetched);
    } catch (err: any) {
      console.error("Fetch jobs error:", err);
      setError("Impossible de charger les offres pour le moment.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Récemment';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmittingJob(true);
    try {
      await createJob(newJob);
      setIsAddModalOpen(false);
      setNewJob({ title: '', location: 'Kinshasa', type: 'CDI', description: '', requirements: '', companyEmail: currentUser.email || '' });
      fetchJobs();
    } catch (error) {
      alert("Erreur lors de la publication.");
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'cvFile' | 'coverLetterFile') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Le fichier est trop volumineux (Max 5Mo)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setApplyData({ ...applyData, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setIsSubmittingApply(true);
    try {
      // Les données sont envoyées dans la collection 'applications'
      // Le recruteur pourra y accéder via son dashboard avec son recruiterId
      await addDoc(collection(db, "applications"), {
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        recruiterId: selectedJob.posterId,
        recruiterName: selectedJob.company,
        recruiterEmail: selectedJob.companyEmail,
        candidateId: currentUser?.id || 'anonymous',
        ...applyData,
        coverLetterMode,
        submittedAt: serverTimestamp()
      });
      alert("Votre candidature a été envoyée avec succès au recruteur !");
      setIsApplyModalOpen(false);
      setApplyData({ ...applyData, cvFile: '', coverLetterText: '', coverLetterFile: '' });
    } catch (error) {
      alert("Erreur lors de l'envoi de la candidature.");
    } finally {
      setIsSubmittingApply(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (job.company || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cdr-blue transition mb-8 font-bold"><ArrowLeft size={20} /> Retour</button>

        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Portail de l'Emploi</h1>
            <p className="text-slate-500 mt-3 font-medium text-lg italic">Trouvez votre prochaine opportunité de carrière.</p>
          </div>
          
          {currentUser && (currentUser.role === UserRole.PARTNER || currentUser.role === UserRole.FORMATEUR) && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-8 py-4 bg-cdr-blue text-white font-black rounded-2xl hover:bg-blue-700 transition flex items-center gap-3 shadow-xl transform active:scale-95"
            >
              <PlusCircle size={22} /> Publier un poste
            </button>
          )}
        </div>

        {/* Barre de recherche */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 mb-10">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Poste, entreprise ou compétences..."
              className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-cdr-blue transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
             <Loader2 className="animate-spin text-cdr-blue mx-auto mb-4" size={48} />
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Chargement des offres...</p>
          </div>
        ) : (
          <div className="grid gap-6 pb-20">
              {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6 group">
                      <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                             <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-cdr-blue shadow-inner group-hover:scale-110 transition-transform">
                                <Building2 size={24} />
                             </div>
                             <div>
                                <h2 className="text-2xl font-black text-slate-900 group-hover:text-cdr-blue transition-colors leading-none mb-1">{job.title}</h2>
                                <p className="text-cdr-blue font-bold text-lg">{job.company}</p>
                             </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest ml-16">
                              <span className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100"><MapPin size={14} className="text-cdr-red" /> {job.location}</span>
                              <span className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100"><Briefcase size={14} className="text-cdr-blue" /> {job.type}</span>
                              <span className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100"><Calendar size={14} className="text-cdr-yellow" /> {formatDate(job.createdAt)}</span>
                          </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => { setSelectedJob(job); setIsDetailModalOpen(true); }}
                            className="flex-1 md:flex-none px-8 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition"
                        >
                            Voir détails
                        </button>
                        <button 
                            onClick={() => { if(!currentUser) navigate('/login'); else { setSelectedJob(job); setIsApplyModalOpen(true); } }}
                            className="flex-1 md:flex-none px-12 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition shadow-lg transform active:scale-95"
                        >
                            Postuler
                        </button>
                      </div>
                  </div>
              )) : (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                    <Briefcase size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aucune offre disponible pour le moment.</p>
                </div>
              )}
          </div>
        )}
      </div>

      {/* MODAL AJOUT JOB (RECRUTEUR) */}
      {isAddModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
              <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col animate-slideUp">
                  <div className="bg-slate-900 p-8 text-white flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-4">
                          <Target size={24} className="text-cdr-blue" />
                          <h2 className="text-2xl font-black">Publier une offre</h2>
                      </div>
                      <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition"><X size={28} /></button>
                  </div>
                  <form onSubmit={handleAddJob} className="flex-1 overflow-y-auto p-10 space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre du poste</label>
                            <input required type="text" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" placeholder="Ex: Développeur Fullstack" />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lieu</label>
                                <input required type="text" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" placeholder="Gombe, Kinshasa" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type de contrat</label>
                                <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold">
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="Stage">Stage</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email de réception des CV</label>
                            <input required type="email" value={newJob.companyEmail} onChange={e => setNewJob({...newJob, companyEmail: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-cdr-blue" placeholder="recrutement@entreprise.cd" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description du job</label>
                            <textarea required rows={4} value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium resize-none" placeholder="Quelles sont les missions principales ?"></textarea>
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Exigences & Profil recherché</label>
                            <textarea required rows={4} value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium resize-none" placeholder="Diplômes, années d'expérience, compétences techniques..."></textarea>
                        </div>
                      </div>
                      <button type="submit" disabled={isSubmittingJob} className="w-full py-5 bg-cdr-blue text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl flex items-center justify-center gap-3">
                          {isSubmittingJob ? <Loader2 className="animate-spin" /> : <>Mettre l'offre en ligne</>}
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* MODAL DÉTAILS JOB */}
      {isDetailModalOpen && selectedJob && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
              <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
                  <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-between items-start">
                      <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-cdr-blue"><Building2 size={32} /></div>
                          <div>
                              <h2 className="text-3xl font-black text-slate-900 leading-none mb-2">{selectedJob.title}</h2>
                              <p className="font-bold text-cdr-blue text-lg">{selectedJob.company}</p>
                          </div>
                      </div>
                      <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={32} /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-10 space-y-10">
                      <div className="flex flex-wrap gap-4">
                          <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex-1 min-w-[140px]"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Localisation</p><p className="font-bold text-slate-700">{selectedJob.location}</p></div>
                          <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex-1 min-w-[140px]"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contrat</p><p className="font-bold text-slate-700">{selectedJob.type}</p></div>
                          <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex-1 min-w-[140px]"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date de publication</p><p className="font-bold text-slate-700">{formatDate(selectedJob.createdAt)}</p></div>
                      </div>

                      <section>
                          <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3"><FileText className="text-cdr-blue" size={24} /> Description du poste</h3>
                          <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 text-slate-600 leading-relaxed font-medium whitespace-pre-wrap text-lg">
                              {selectedJob.description}
                          </div>
                      </section>

                      <section>
                          <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3"><CheckCircle className="text-green-500" size={24} /> Profil & Exigences</h3>
                          <div className="bg-green-50/30 p-8 rounded-3xl border border-green-100 text-slate-600 leading-relaxed font-medium whitespace-pre-wrap text-lg">
                              {selectedJob.requirements || "Aucune exigence spécifique mentionnée."}
                          </div>
                      </section>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                      <button onClick={() => setIsDetailModalOpen(false)} className="px-8 py-4 font-black text-slate-500 uppercase tracking-widest text-xs">Fermer</button>
                      <button onClick={() => { setIsDetailModalOpen(false); setIsApplyModalOpen(true); }} className="px-12 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition shadow-xl transform active:scale-95">Postuler maintenant</button>
                  </div>
              </div>
          </div>
      )}

      {/* MODAL POSTULER (CANDIDAT) */}
      {isApplyModalOpen && selectedJob && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
              <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col animate-slideUp">
                  <div className="bg-cdr-blue p-8 text-white flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-4">
                          <Send size={24} />
                          <h2 className="text-2xl font-black truncate max-w-[400px]">Candidature : {selectedJob.title}</h2>
                      </div>
                      <button onClick={() => setIsApplyModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition"><X size={28} /></button>
                  </div>
                  
                  <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-10 space-y-8">
                      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center gap-5">
                        <Building2 size={32} className="text-cdr-blue shrink-0" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recruteur</p>
                            <p className="text-lg font-black text-blue-900">{selectedJob.company}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet du candidat</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input required type="text" value={applyData.candidateName} onChange={e => setApplyData({...applyData, candidateName: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Votre email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input required type="email" value={applyData.candidateEmail} onChange={e => setApplyData({...applyData, candidateEmail: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                            </div>
                        </div>
                      </div>

                      {/* Upload CV */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Votre Curriculum Vitae (CV)</label>
                        <div 
                            onClick={() => document.getElementById('apply-cv')?.click()}
                            className={`h-36 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${applyData.cvFile ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-cdr-blue hover:bg-blue-50/30'}`}
                        >
                            {applyData.cvFile ? (
                                <div className="flex flex-col items-center gap-2 text-green-600 font-bold">
                                    <CheckCircle size={32} /> <span>CV Importé avec succès</span>
                                    <p className="text-[9px] uppercase tracking-tighter opacity-70">Cliquez pour modifier</p>
                                </div>
                            ) : (
                                <>
                                    <Upload size={40} className="text-slate-300 mb-3" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliquez pour importer votre CV</p>
                                    <p className="text-[9px] text-slate-300 uppercase mt-1">Formats acceptés : PDF, DOC, DOCX (Max 5Mo)</p>
                                </>
                            )}
                            <input id="apply-cv" type="file" required className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'cvFile')} />
                        </div>
                      </div>

                      {/* Lettre de Motivation Mode */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lettre de motivation</label>
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                <button type="button" onClick={() => setCoverLetterMode('text')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${coverLetterMode === 'text' ? 'bg-white text-cdr-blue shadow-sm' : 'text-slate-500'}`}>Rédiger</button>
                                <button type="button" onClick={() => setCoverLetterMode('file')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${coverLetterMode === 'file' ? 'bg-white text-cdr-blue shadow-sm' : 'text-slate-500'}`}>Joindre fichier</button>
                            </div>
                        </div>

                        {coverLetterMode === 'text' ? (
                            <textarea 
                                required 
                                rows={5} 
                                value={applyData.coverLetterText} 
                                onChange={e => setApplyData({...applyData, coverLetterText: e.target.value})} 
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none font-medium resize-none focus:ring-2 focus:ring-cdr-blue transition-all" 
                                placeholder="Expliquez brièvement pourquoi ce poste vous intéresse et ce que vous pouvez apporter à l'entreprise..."
                            ></textarea>
                        ) : (
                            <div 
                                onClick={() => document.getElementById('apply-lm')?.click()}
                                className={`h-36 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${applyData.coverLetterFile ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-cdr-blue hover:bg-blue-50/30'}`}
                            >
                                {applyData.coverLetterFile ? (
                                    <div className="flex flex-col items-center gap-2 text-green-600 font-bold">
                                        {/* Added missing FileCheck icon */}
                                        <FileCheck size={32} /> <span>Document joint</span>
                                    </div>
                                ) : (
                                    <>
                                        <FileUp size={40} className="text-slate-300 mb-3" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Joindre votre lettre de motivation</p>
                                        <p className="text-[9px] text-slate-300 uppercase mt-1">PDF, DOC, DOCX</p>
                                    </>
                                )}
                                <input id="apply-lm" type="file" required={coverLetterMode === 'file'} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'coverLetterFile')} />
                            </div>
                        )}
                      </div>

                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4">
                        <Info size={20} className="text-cdr-blue shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">
                            En postulant, vos informations seront transmises à l'équipe de recrutement de {selectedJob.company} et stockées en toute sécurité sur les serveurs de BOMOKO.
                        </p>
                      </div>

                      <button type="submit" disabled={isSubmittingApply || !applyData.cvFile} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition shadow-xl flex items-center justify-center gap-4 disabled:opacity-50 transform active:scale-95 uppercase tracking-widest text-sm">
                          {isSubmittingApply ? <Loader2 className="animate-spin" /> : <>Envoyer ma candidature au recruteur <Send size={18} /></>}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Jobs;
