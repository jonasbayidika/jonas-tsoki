
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2, ArrowLeft, MessageSquare, ChevronDown, ChevronUp, Sparkles, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex justify-between items-center text-left hover:text-cdr-blue transition-colors group"
            >
                <span className="font-black text-slate-800 pr-8">{question}</span>
                {isOpen ? <ChevronUp className="text-cdr-blue" /> : <ChevronDown className="text-slate-400 group-hover:text-cdr-blue" />}
            </button>
            {isOpen && (
                <div className="pb-6 animate-fadeIn">
                    <p className="text-slate-500 leading-relaxed font-medium">{answer}</p>
                </div>
            )}
        </div>
    );
};

const Contact: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const navigate = useNavigate();
  const { startConversation } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 2000);
  };

  const faqs = [
    { question: "Comment certifier mon compte ?", answer: "Rendez-vous dans l'onglet 'Profil' de votre espace personnel, puis cliquez sur 'Certification'. Vous devrez télécharger une pièce d'identité valide (Carte d'électeur ou Passeport)." },
    { question: "Le service KOOP est-il gratuit ?", answer: "La consultation des annonces est gratuite. Pour publier des articles de façon illimitée et bénéficier de la protection Bomoko, un abonnement Premium est recommandé." },
    { question: "Comment devenir formateur sur Bomoko ?", answer: "Lors de votre inscription, choisissez le rôle 'Formateur'. Une fois votre identité certifiée par nos services, vous pourrez uploader vos modules vidéos depuis votre bureau." },
    { question: "Quels sont les modes de paiement acceptés ?", answer: "Nous supportons majoritairement le Mobile Money (M-Pesa, Orange Money, Airtel Money) ainsi que les cartes Visa et MasterCard pour les transactions internationales." }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-cdr-blue transition mb-12 font-black uppercase text-[10px] tracking-widest">
            <ArrowLeft size={16} /> Retour
        </button>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* GAUCHE: SUPPORT & FAQ */}
          <div className="lg:col-span-7 space-y-16">
            <div className="animate-fadeIn">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-cdr-blue px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                   <Sparkles size={14} /> Aide & Support
                </div>
                <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">On s'occupe de vous.</h1>
                <p className="text-slate-500 text-lg max-w-xl leading-relaxed font-medium">
                    Une question technique ? Un problème avec un paiement ? Notre équipe est disponible du lundi au samedi.
                </p>
            </div>
            
            {/* ORIENTATION SUPPORT CHAT */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><MessageSquare size={120}/></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-4">Discutez en direct</h3>
                    <p className="text-slate-400 mb-10 leading-relaxed max-w-md">L'assistance via messagerie est le moyen le plus rapide d'obtenir une réponse de nos agents Bomoko.</p>
                    <button 
                        onClick={() => startConversation('support', 'Support Bomoko')}
                        className="px-10 py-5 bg-cdr-blue text-white font-black rounded-2xl hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl shadow-blue-500/20 uppercase text-xs tracking-widest"
                    >
                        Ouvrir le Chat Support <Send size={18} />
                    </button>
                </div>
            </div>

            {/* FAQ SECTION */}
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><UserCheck className="text-cdr-blue" /> Questions Fréquentes</h3>
                <div className="divide-y divide-slate-50">
                    {faqs.map((faq, idx) => (
                        <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </section>
          </div>

          {/* DROITE: FORMULAIRE & CONTACTS */}
          <div className="lg:col-span-5 space-y-10 sticky top-24">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 animate-slideUp">
                <h3 className="text-2xl font-black mb-8 text-slate-900">Écrivez-nous</h3>
                
                {formStatus === 'success' ? (
                  <div className="py-12 text-center animate-fadeIn">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-2">Message Envoyé !</h4>
                    <p className="text-slate-500 font-medium text-sm mb-8">Merci, nous reviendrons vers vous sous 24h.</p>
                    <button onClick={() => setFormStatus('idle')} className="text-cdr-blue font-black text-xs uppercase tracking-widest hover:underline">Envoyer un autre message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                        <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cdr-blue transition-all font-bold" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sujet</label>
                        <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cdr-blue transition-all font-bold">
                            <option>Paiement</option>
                            <option>Compte</option>
                            <option>Partenariat</option>
                            <option>Autre</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                        <input required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cdr-blue transition-all font-bold" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Votre Message</label>
                        <textarea required rows={4} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-cdr-blue transition-all font-medium resize-none"></textarea>
                    </div>
                    <button type="submit" disabled={formStatus === 'submitting'} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition flex items-center justify-center gap-3 shadow-xl">
                      {formStatus === 'submitting' ? <Loader2 size={24} className="animate-spin" /> : <>Envoyer le dossier <Send size={18} /></>}
                    </button>
                  </form>
                )}
            </div>

            <div className="space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-6 group hover:border-cdr-blue transition-all">
                    <div className="w-12 h-12 bg-blue-50 text-cdr-blue rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><MapPin size={22} /></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase">Kinshasa HQ</p><p className="font-bold text-slate-800 text-sm">Gombe, Av. Libération</p></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-6 group hover:border-cdr-red transition-all">
                    <div className="w-12 h-12 bg-red-50 text-cdr-red rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Mail size={22} /></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase">Support Direct</p><p className="font-bold text-slate-800 text-sm">contact@bomoko.cd</p></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
