
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Check, X, Shield, Star, Crown, Zap, Smartphone, CreditCard, Loader2, ArrowLeft, Building2, Briefcase } from 'lucide-react';
import { SubscriptionTier, UserRole } from '../types';

const Subscription: React.FC = () => {
    const { user, subscribe } = useAuth();
    const navigate = useNavigate();
    
    const [selectedTier, setSelectedTier] = useState<{name: string, price: string, id: SubscriptionTier} | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'select' | 'form' | 'processing' | 'success'>('select');
    const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'orange' | 'airtel' | 'card' | null>(null);
    
    const [paymentPhone, setPaymentPhone] = useState('');
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });

    const isPartner = user?.role === UserRole.PARTNER;

    const handleSelectTier = (tier: {name: string, price: string, id: SubscriptionTier}) => {
        if (!user) { navigate('/login'); return; }
        setSelectedTier(tier);
        setIsPaymentModalOpen(true);
        setPaymentStep('select');
    };

    const handleMethodSelect = (method: 'mpesa' | 'orange' | 'airtel' | 'card') => {
        setSelectedMethod(method);
        setPaymentStep('form');
    };

    const processPayment = () => {
        setPaymentStep('processing');
        setTimeout(() => {
            if (selectedTier) { subscribe(selectedTier.id); }
            setPaymentStep('success');
            setTimeout(() => {
                setIsPaymentModalOpen(false);
                navigate('/dashboard');
            }, 2000);
        }, 2000);
    };

    const tiers = [
        {
            id: 'standard' as SubscriptionTier,
            name: isPartner ? 'Starter Business' : 'Standard',
            price: '10$',
            period: '/ mois',
            color: 'bg-slate-100 text-slate-800',
            icon: isPartner ? <Building2 size={32} /> : <Shield size={32} />,
            features: isPartner ? [
                'Publication de 2 offres d\'emploi/mois',
                'Accès à la marketplace KOOP (3 annonces)',
                'Badge "Partenaire Vérifié"',
                'Support par email'
            ] : [
                'Certification du profil (Badge Bleu)',
                'Accès à l\'espace "Mon Bureau"',
                'Postuler aux offres d\'emploi',
                'Support par email'
            ],
            recommended: false
        },
        {
            id: 'premium' as SubscriptionTier,
            name: isPartner ? 'Professional Business' : 'Premium',
            price: '25$',
            period: '/ mois',
            color: 'bg-cdr-blue text-white',
            icon: isPartner ? <Briefcase size={32} /> : <Star size={32} />,
            features: isPartner ? [
                'Offres d\'emploi illimitées',
                'Vente illimitée sur KOOP Market',
                'Mise en avant du logo sur la Home',
                'Statistiques de vues détaillées',
                'Support prioritaire 24/7'
            ] : [
                'Tout du pack Standard',
                'Vente illimitée sur KOOP Market',
                'Badge "Premium" distinctif',
                'Visibilité accrue dans les recherches',
                'Support prioritaire 24/7'
            ],
            recommended: true
        },
        {
            id: 'gold' as SubscriptionTier,
            name: isPartner ? 'Enterprise Elite' : 'Gold',
            price: '50$',
            period: '/ mois',
            color: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
            icon: <Crown size={32} />,
            features: isPartner ? [
                'Tout du pack Professional',
                'Création de Communautés illimitées',
                'Accès à la base de données CV',
                'Promotion hebdomadaire par notification',
                'Intervention directe Bomoko Bot'
            ] : [
                'Tout du pack Premium',
                'Création de Communautés certifiées',
                'Accès aux événements VIP',
                'Mentorat personnalisé (1h/mois)',
                'Publicité gratuite (1 par mois)'
            ],
            recommended: false
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-cdr-blue transition mb-8 font-bold">
                    <ArrowLeft size={20} /> Retour au Dashboard
                </button>

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                        {isPartner ? 'Boostez votre Entreprise' : 'Choisissez votre Certification'}
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        {isPartner 
                            ? 'Débloquez les outils de recrutement et de vente pour toucher des milliers de jeunes congolais.'
                            : 'Débloquez tout le potentiel de BOMOKO avec un compte certifié.'}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {tiers.map((tier) => (
                        <div key={tier.id} className={`relative bg-white rounded-[2.5rem] shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 border ${tier.recommended ? 'border-cdr-blue ring-4 ring-blue-50' : 'border-slate-100'}`}>
                            {tier.recommended && (
                                <div className="absolute top-0 right-0 bg-cdr-blue text-white text-[10px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest">
                                    Recommandé
                                </div>
                            )}
                            
                            <div className={`p-10 text-center ${tier.id === 'gold' ? tier.color : tier.recommended ? 'bg-blue-50/30' : ''}`}>
                                <div className={`w-20 h-20 mx-auto rounded-[2rem] flex items-center justify-center mb-6 shadow-sm ${tier.id === 'gold' ? 'bg-white/20' : 'bg-white text-cdr-blue border border-slate-100'}`}>
                                    {tier.icon}
                                </div>
                                <h3 className={`text-2xl font-black mb-2 ${tier.id === 'gold' ? 'text-white' : 'text-slate-900'}`}>{tier.name}</h3>
                                <div className={`flex justify-center items-baseline ${tier.id === 'gold' ? 'text-white' : 'text-slate-900'}`}>
                                    <span className="text-5xl font-black tracking-tighter">{tier.price}</span>
                                    <span className={`ml-2 text-sm font-bold ${tier.id === 'gold' ? 'text-white/80' : 'text-slate-500'}`}>{tier.period}</span>
                                </div>
                            </div>

                            <div className="p-10">
                                <ul className="space-y-4 mb-10">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Check size={14} /></div>
                                            <span className="text-slate-600 text-sm font-medium leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    onClick={() => handleSelectTier(tier)}
                                    className={`w-full py-4 rounded-2xl font-black transition flex items-center justify-center gap-3 shadow-xl ${
                                        user?.subscriptionTier === tier.id 
                                        ? 'bg-slate-100 text-slate-400 cursor-default'
                                        : tier.recommended 
                                            ? 'bg-cdr-blue text-white hover:bg-blue-700 shadow-blue-200' 
                                            : (tier.id === 'gold' ? 'bg-white text-slate-900 hover:bg-slate-50' : 'bg-slate-900 text-white hover:bg-black shadow-slate-200')
                                    }`}
                                >
                                    {user?.subscriptionTier === tier.id ? 'Abonnement Actuel' : 'Activer ce pack'} <Zap size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* PAYMENT MODAL (Simplified for brevity) */}
                {isPaymentModalOpen && selectedTier && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setIsPaymentModalOpen(false)}>
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-slideUp" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-slate-900 p-8 text-center relative">
                                <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white transition"><X size={24} /></button>
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><Smartphone className="text-yellow-400" size={32} /></div>
                                <h2 className="text-2xl font-black text-white">Paiement Mobile</h2>
                                <p className="text-blue-200 text-sm mt-1">{selectedTier.name} • {selectedTier.price}</p>
                            </div>

                            <div className="p-8">
                                {paymentStep === 'select' && (
                                    <div className="space-y-3">
                                        <button onClick={() => handleMethodSelect('mpesa')} className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-green-500 hover:bg-green-50 flex items-center gap-4 transition group"><div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition"><Smartphone size={20} /></div><span className="font-bold text-slate-700">M-Pesa (Vodacom)</span></button>
                                        <button onClick={() => handleMethodSelect('orange')} className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 flex items-center gap-4 transition group"><div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition"><Smartphone size={20} /></div><span className="font-bold text-slate-700">Orange Money</span></button>
                                        <button onClick={() => handleMethodSelect('card')} className="w-full p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 flex items-center gap-4 transition group"><div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition"><CreditCard size={20} /></div><span className="font-bold text-slate-700">Carte de Crédit</span></button>
                                    </div>
                                )}

                                {paymentStep === 'form' && (
                                    <div className="space-y-4 animate-fadeIn">
                                        <button onClick={() => setPaymentStep('select')} className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-slate-900 mb-2"><ArrowLeft size={12}/> Retour</button>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Numéro de téléphone</label>
                                            <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cdr-blue" placeholder="+243..." value={paymentPhone} onChange={e => setPaymentPhone(e.target.value)} />
                                        </div>
                                        <button onClick={processPayment} className="w-full py-4 bg-cdr-blue text-white font-black rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 mt-4">Confirmer le paiement</button>
                                    </div>
                                )}

                                {paymentStep === 'processing' && (
                                    <div className="text-center py-12">
                                        <Loader2 size={48} className="text-cdr-blue animate-spin mx-auto mb-6" />
                                        <h3 className="font-black text-xl text-slate-900">Traitement...</h3>
                                        <p className="text-slate-500 text-sm mt-2">Veuillez valider l'opération sur votre téléphone.</p>
                                    </div>
                                )}

                                {paymentStep === 'success' && (
                                    <div className="text-center py-12 animate-fadeIn">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100"><Check size={40} /></div>
                                        <h3 className="font-black text-2xl text-slate-900">Pack Activé !</h3>
                                        <p className="text-slate-500 text-sm mt-2">Votre entreprise bénéficie maintenant de toutes les options Premium.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Subscription;
