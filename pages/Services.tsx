
import React, { useState, useEffect } from 'react';
import { 
    Briefcase, GraduationCap, Megaphone, ShoppingBag, 
    PlayCircle, ArrowLeft, Search, Sparkles, ArrowRight,
    Lock, CreditCard, ShieldCheck, Smartphone
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// Removed non-existent Course import from '../types'
import { Training, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

const Services: React.FC = () => {
  const { user, enrollInCourse } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hub' | 'courses'>('hub');
  
  const [courses, setCourses] = useState<Training[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Training | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
      const stored = localStorage.getItem('bomoko_trainings');
      if (stored) {
          setCourses(JSON.parse(stored));
      }
  }, []);

  const handleAccessCourse = (course: Training) => {
      if (!user) { navigate('/login'); return; }
      
      const isFree = course.price.toLowerCase().includes('gratuit');
      const hasPaid = user.enrolledCourses?.includes(course.id);

      if (isFree || hasPaid) {
          navigate(`/course/${course.id}`);
      } else {
          setSelectedCourse(course);
          setIsPaymentOpen(true);
      }
  };

  const handlePaymentSuccess = async () => {
    if (selectedCourse && user) {
        await enrollInCourse(selectedCourse.id);
        setIsPaymentOpen(false);
        navigate(`/course/${selectedCourse.id}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4">
      {activeTab === 'hub' && (
        <div className="max-w-7xl mx-auto animate-fadeIn">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cdr-blue transition mb-8 font-bold"><ArrowLeft size={20} /> Retour</button>
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-cdr-blue px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                   <Sparkles size={14} /> Hub des Opportunités
                </div>
                <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Accélérez votre avenir.</h1>
                <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg italic">Plateforme vérifiée connectée à la base de données Bomoko Jeunesse Congo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div onClick={() => navigate('/services/training')} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
                    <div className="w-20 h-20 bg-blue-100 text-cdr-blue rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner relative z-10"><GraduationCap size={40} /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 relative z-10">Académie Bomoko</h3>
                    <p className="text-slate-500 font-medium mb-8 relative z-10 leading-relaxed">Cours certifiants avec paiement mobile intégré pour tous les Congolais.</p>
                    <Link to="/services" onClick={(e) => { e.preventDefault(); setActiveTab('courses'); }} className="inline-flex items-center gap-3 text-cdr-blue font-black text-sm uppercase tracking-widest group-hover:gap-6 transition-all">Découvrir <ArrowRight size={18} /></Link>
                </div>

                <Link to="/jobs" className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner relative z-10"><Briefcase size={40} /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 relative z-10">Bourse de l'Emploi</h3>
                    <p className="text-slate-500 font-medium mb-8 relative z-10 leading-relaxed">Consultez des centaines d'offres de stages et d'emplois partout en RDC.</p>
                    <span className="inline-flex items-center gap-3 text-green-600 font-black text-sm uppercase tracking-widest group-hover:gap-6 transition-all">Postuler <ArrowRight size={18} /></span>
                </Link>

                <Link to="/koop" className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
                    <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-inner relative z-10"><ShoppingBag size={40} /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 relative z-10">KOOP Market</h3>
                    <p className="text-slate-500 font-medium mb-8 relative z-10 leading-relaxed">Vendez et achetez en toute sécurité sur le premier marché numérique de confiance.</p>
                    <span className="inline-flex items-center gap-3 text-yellow-600 font-black text-sm uppercase tracking-widest group-hover:gap-6 transition-all">Visiter le marché <ArrowRight size={18} /></span>
                </Link>
            </div>
        </div>
      )}

      {activeTab === 'courses' && (
          <div className="max-w-7xl mx-auto animate-fadeIn">
              <button onClick={() => setActiveTab('hub')} className="flex items-center gap-2 text-slate-500 hover:text-cdr-blue transition mb-8 font-bold"><ArrowLeft size={20} /> Retour aux services</button>
              
              <div className="bg-slate-900 rounded-3xl p-8 mb-12 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                  <div className="w-16 h-16 bg-cdr-blue rounded-2xl flex items-center justify-center"><ShieldCheck size={32} /></div>
                  <div className="flex-1">
                      <h2 className="text-xl font-black">Vérification de Propriété Numérique</h2>
                      <p className="text-slate-400 text-sm">Chaque cours payant requiert une transaction validée sur le réseau Bomoko (Firebase Database).</p>
                  </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Académie & Cours</h2>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Rechercher un cours..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cdr-blue outline-none font-medium shadow-sm" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {courses.map(course => {
                      const isEnrolled = user?.enrolledCourses?.includes(course.id);
                      const isFree = course.price.includes('Gratuit');

                      return (
                        <div key={course.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                            <div className="h-56 overflow-hidden relative">
                                <img src={course.image} className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700" alt={course.title} />
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-black uppercase text-cdr-blue shadow-lg border border-blue-50">{course.price}</div>
                                {!isEnrolled && !isFree && (
                                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-white p-3 rounded-2xl text-slate-900 shadow-xl"><Lock size={24} /></div>
                                    </div>
                                )}
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{course.source}</div>
                                <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-cdr-blue transition-colors leading-snug">{course.title}</h3>
                                <p className="text-sm text-slate-500 mb-8 font-medium">Expert : {course.provider}</p>
                                
                                <button 
                                    onClick={() => handleAccessCourse(course)} 
                                    className={`mt-auto w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg transform active:scale-95 ${isEnrolled || isFree ? 'bg-slate-900 text-white hover:bg-cdr-blue' : 'bg-cdr-blue text-white hover:bg-blue-700'}`}
                                >
                                    {isEnrolled || isFree ? <><PlayCircle size={20} /> Rejoindre le cours</> : <><Smartphone size={20} /> Payer ({course.price})</>}
                                </button>
                            </div>
                        </div>
                      );
                  })}
              </div>

              {selectedCourse && (
                  <PaymentModal 
                    isOpen={isPaymentOpen}
                    onClose={() => setIsPaymentOpen(false)}
                    onSuccess={handlePaymentSuccess}
                    itemName={selectedCourse.title}
                    itemPrice={selectedCourse.price}
                  />
              )}
          </div>
      )}
    </div>
  );
};

export default Services;
