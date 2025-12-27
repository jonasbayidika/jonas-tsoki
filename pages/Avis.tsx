
import React, { useState } from 'react';
import { Star, Send, CheckCircle, ArrowLeft, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Avis: React.FC = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return alert("Veuillez donner une note !");
        
        setIsProcessing(true);
        try {
            // Mise à jour de Firebase via AuthContext
            await updateProfile({ hasGivenAvis: true });
            setSubmitted(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (error) {
            alert("Erreur lors de l'enregistrement de votre avis. Veuillez réessayer.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md text-center animate-fadeIn border border-slate-100">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <CheckCircle size={56} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Merci pour votre avis !</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Votre témoignage aide la communauté Bomoko à grandir et à s'améliorer chaque jour. Vous allez être redirigé...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-16 px-4">
            <div className="max-w-3xl mx-auto">
                {user?.hasGivenAvis && (
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cdr-blue transition mb-8 font-bold">
                        <ArrowLeft size={20} /> Retour
                    </button>
                )}

                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden animate-slideUp">
                    <div className="bg-slate-900 p-10 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><MessageSquare size={120} /></div>
                        <div className="relative z-10">
                            <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"><Sparkles size={14} /> Partagez votre expérience</span>
                            <h1 className="text-4xl font-black tracking-tight mb-2">Votre avis compte.</h1>
                            <p className="text-slate-400 font-medium">Aidez-nous à construire la meilleure plateforme pour la RDC.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-10">
                        <div className="space-y-4 text-center">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Quelle est votre note globale ?</label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="p-2 transition-transform hover:scale-125 transform active:scale-95"
                                    >
                                        <Star 
                                            size={48} 
                                            className={`${(hover || rating) >= star ? 'text-cdr-yellow fill-current' : 'text-slate-200'}`} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Votre témoignage (Optionnel)</label>
                            <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                                placeholder="Comment Bomoko a changé votre quotidien ?"
                                className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-100 font-medium text-slate-700 resize-none transition-all"
                            />
                        </div>

                        {!user?.hasGivenAvis && (
                            <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start gap-4">
                                <ShieldCheck className="text-cdr-red shrink-0" />
                                <p className="text-xs text-red-800 leading-relaxed font-bold uppercase">Attention : La soumission d'un avis est obligatoire pour continuer à utiliser la plateforme.</p>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={rating === 0 || isProcessing}
                            className="w-full py-6 bg-cdr-blue text-white font-black rounded-3xl hover:bg-blue-700 transition shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-4 text-lg uppercase tracking-widest disabled:opacity-50"
                        >
                            {isProcessing ? "Enregistrement..." : "Envoyer mon avis"} <Send size={24} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Avis;
