
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, Users, Briefcase, DollarSign, Calendar, 
    Settings, AlertTriangle, ArrowLeft, Crown, PlusCircle, 
    Megaphone, ShoppingBag, Lock, User, BookOpen, Bell,
    ChevronRight, PlayCircle, MessageSquare, CheckCircle2, Clock, Loader2,
    BarChart3, Target, Share2, TrendingUp, Eye, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const MyOffice: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const isPartner = user?.role === UserRole.PARTNER;
    const hasSubscription = user?.subscriptionTier && user?.subscriptionTier !== 'standard';

    if (!user?.isCertified && user?.certificationStatus !== 'certified') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md text-center border border-slate-100 animate-fadeIn">
                    <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-4">Certification Requise</h1>
                    <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                        Le Bureau Professionnel est réservé aux comptes certifiés. Veuillez valider votre identité ou passer Premium pour continuer.
                    </p>
                    <button onClick={() => navigate('/profile')} className="w-full py-4 bg-cdr-blue text-white font-black rounded-xl hover:bg-blue-700 transition shadow-xl shadow-blue-100">
                         Aller à la Certification
                    </button>
                </div>
            </div>
        );
    }

    const StatCard = ({ label, value, icon, color }: any) => (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                {icon}
            </div>
            <div className="text-4xl font-black text-slate-900 mb-1">{value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-slate-900 text-white py-12 px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cdr-blue opacity-10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/50 hover:text-white transition mb-8 font-black uppercase text-[10px] tracking-widest">
                        <ArrowLeft size={16} /> Retour au Dashboard
                    </button>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cdr-yellow text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest mb-4">
                                <Crown size={12} /> Espace Business Premium
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight">Mon Bureau Pro</h1>
                            <p className="text-slate-400 font-medium text-lg mt-2 italic">Gérez votre croissance et vos opportunités commerciales en RDC.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all backdrop-blur-md">
                                Analytics <TrendingUp size={16} className="inline ml-2"/>
                            </button>
                            <button onClick={() => navigate('/settings')} className="p-4 bg-cdr-blue rounded-2xl hover:bg-blue-600 shadow-xl shadow-blue-500/20 transition-all">
                                <Settings size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-16 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Fixed missing 'Eye' import */}
                    <StatCard label="Vues du Business" value="1.2k" color="bg-blue-50 text-cdr-blue" icon={<Eye size={28}/>} />
                    <StatCard label="Conversion" value="12%" color="bg-green-50 text-cdr-green" icon={<Target size={28}/>} />
                    <StatCard label="Total Revenus" value="450$" color="bg-yellow-50 text-cdr-yellow" icon={<DollarSign size={28}/>} />
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        {/* Gestion Recrutement (si partenaire) */}
                        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Gestion Recrutement</h3>
                                    <p className="text-slate-400 text-sm font-medium">Suivez vos offres et les nouveaux talents.</p>
                                </div>
                                <button onClick={() => navigate('/jobs')} className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all">
                                    <PlusCircle size={24} />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-cdr-blue transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-cdr-blue font-black shadow-sm">12</div>
                                        <div><p className="font-black text-slate-800">Candidatures reçues</p><p className="text-[10px] text-slate-400 font-bold uppercase">Cette semaine</p></div>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:translate-x-2 transition-transform" />
                                </div>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:border-cdr-blue transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-cdr-red font-black shadow-sm">2</div>
                                        <div><p className="font-black text-slate-800">Offres actives</p><p className="text-[10px] text-slate-400 font-bold uppercase">En ligne</p></div>
                                    </div>
                                    <ChevronRight className="text-slate-300 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </section>

                        {/* Gestion KOOP (Ventes) */}
                        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
                             <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Catalogue KOOP</h3>
                                    <p className="text-slate-400 text-sm font-medium">Contrôlez votre stock sur le marché numérique.</p>
                                </div>
                                <button onClick={() => navigate('/koop')} className="px-6 py-3 bg-cdr-green text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-500/20">Ajouter Stock</button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-8 bg-green-50/50 rounded-[2.5rem] border border-green-100 text-center">
                                    <p className="text-4xl font-black text-cdr-green">08</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Articles vendus</p>
                                </div>
                                <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 text-center">
                                    <p className="text-4xl font-black text-cdr-blue">15</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Messages reçus</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={100} /></div>
                             {/* Fixed missing 'ShieldCheck' import */}
                             <h4 className="text-xl font-black mb-2 flex items-center gap-3"><ShieldCheck className="text-cdr-yellow" /> Portefeuille</h4>
                             <p className="text-slate-400 text-sm mb-10">Crédit disponible pour vos campagnes de publicité.</p>
                             <div className="text-5xl font-black mb-10">0.00 $</div>
                             <button className="w-full py-4 bg-cdr-blue text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20">Recharger</button>
                        </div>

                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-200">
                            <h4 className="font-black text-slate-900 mb-6 flex items-center gap-3"><Share2 size={20} className="text-cdr-blue"/> Publicité Rapide</h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8">Boostez vos annonces pour toucher 10x plus de personnes en RDC.</p>
                            <button className="w-full py-4 border-2 border-slate-100 text-slate-400 font-black rounded-2xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 cursor-not-allowed">
                                <Lock size={14}/> Service bientôt disponible
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyOffice;
