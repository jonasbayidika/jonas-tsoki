
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation, Language } from '../context/LanguageContext';
import { 
    User, Phone, MapPin, Save, Globe, Lock, Trash2, 
    Info, ArrowLeft, AlertCircle, Bell, 
    ShieldCheck, LogOut, ChevronRight, CheckCircle2,
    ShieldAlert, Laptop
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
    const { user, updateProfile, logout } = useAuth();
    const { t, language, setLanguage } = useTranslation();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        postname: '',
        bio: '',
        phone: '',
        location: '',
        language: 'fr' as Language,
        notifEmail: true,
        notifSms: false,
        visibility: 'public'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                postname: user.postname || '',
                bio: user.bio || '',
                phone: user.phone || '',
                location: user.location || '',
                language: (user.preferences?.language as Language) || language,
                notifEmail: user.preferences?.notifications.email ?? true,
                notifSms: user.preferences?.notifications.sms ?? false,
                visibility: user.preferences?.visibility || 'public'
            });
        }
    }, [user, language]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        const checked = (e.target as HTMLInputElement).checked;

        if (name === 'language') {
            setLanguage(value as Language);
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setError('');
        
        if (formData.phone) {
            const cleanPhone = formData.phone.replace(/\s/g, '');
            if (!cleanPhone.startsWith('+243') && cleanPhone.length > 0) {
                setError("Le numéro de téléphone doit commencer par +243.");
                return;
            }
        }

        const updatedData = {
            name: formData.name,
            postname: formData.postname,
            bio: formData.bio,
            phone: formData.phone.trim(),
            location: formData.location,
            preferences: {
                language: formData.language,
                visibility: formData.visibility,
                notifications: {
                    email: formData.notifEmail,
                    sms: formData.notifSms,
                    push: true
                }
            }
        };

        updateProfile(updatedData);
        setSuccessMessage(t('settings_save') + " !");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSuccessMessage(''), 4000);
    };

    const Toggle = ({ name, checked, label, desc }: { name: string, checked: boolean, label: string, desc: string }) => (
        <div className="flex items-center justify-between py-2">
            <div className="flex flex-col pr-4">
                <span className="text-sm font-black text-slate-800">{label}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{desc}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name={name} checked={checked} onChange={handleInputChange} className="sr-only peer" />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cdr-blue"></div>
            </label>
        </div>
    );

    if (!user) return <div className="flex items-center justify-center min-h-screen bg-slate-50"><Info className="animate-spin text-cdr-blue" /></div>;

    return (
        <div className="bg-slate-50 min-h-screen py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <button onClick={() => navigate('/profile')} className="p-4 bg-white hover:bg-slate-50 rounded-2xl transition text-slate-500 shadow-sm border border-slate-100 transform active:scale-90">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('settings_title')}</h1>
                            <p className="text-slate-500 text-sm font-medium">Gérez votre compte et vos préférences Bomoko.</p>
                        </div>
                    </div>
                    
                    <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-3 px-6 py-3 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition text-sm">
                        <LogOut size={18} /> Déconnexion
                    </button>
                </div>

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-8 py-5 rounded-[2rem] mb-10 flex items-center gap-4 animate-fadeIn">
                        <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200"><CheckCircle2 size={24} /></div>
                        <span className="font-black">{successMessage}</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-5 rounded-[2rem] mb-10 flex items-center gap-4 animate-fadeIn">
                        <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-200"><AlertCircle size={24} /></div>
                        <span className="font-black">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-10 pb-20">
                    
                    {/* Profil Section */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden animate-slideUp" style={{ animationDelay: '0.1s' }}>
                        <div className="px-10 py-8 border-b border-gray-50 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="flex items-center gap-4 font-black text-xl text-slate-900">
                                <User size={24} className="text-cdr-blue" /> Informations Publiques
                            </h2>
                            <span className="text-[10px] font-black bg-blue-100 text-cdr-blue px-3 py-1 rounded-full uppercase tracking-widest">Public</span>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Prénom / Nom</label>
                                    <input name="name" type="text" value={formData.name} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cdr-blue outline-none font-bold text-slate-700 transition" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Postnom</label>
                                    <input name="postname" type="text" value={formData.postname} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cdr-blue outline-none font-bold text-slate-700 transition" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Téléphone RDC</label>
                                    <div className="relative">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input name="phone" type="text" value={formData.phone} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cdr-blue outline-none font-bold text-slate-700 transition" placeholder="+243..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Localisation</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input name="location" type="text" value={formData.location} onChange={handleInputChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cdr-blue outline-none font-bold text-slate-700 transition" placeholder="Kinshasa, Gombe" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Bio & Parcours</label>
                                <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cdr-blue outline-none resize-none font-medium text-slate-600 transition" placeholder="Parlez-nous de vous..." />
                            </div>
                        </div>
                    </div>

                    {/* App Config Grid */}
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Langue */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden animate-slideUp" style={{ animationDelay: '0.2s' }}>
                            <div className="px-8 py-6 border-b border-gray-50 bg-slate-50/50 flex items-center gap-4 font-black text-lg text-slate-900">
                                <Globe size={20} className="text-cdr-yellow" /> Langue de l'application
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('settings_lang')}</label>
                                    <select 
                                        name="language" 
                                        value={formData.language} 
                                        onChange={handleInputChange} 
                                        className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cdr-blue outline-none bg-slate-50 font-bold text-slate-700 appearance-none shadow-sm"
                                    >
                                        <option value="fr">Français (RDC)</option>
                                        <option value="en">English (US)</option>
                                        <option value="ln">Lingala (Congo)</option>
                                        <option value="sw">Kiswahili (East)</option>
                                    </select>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Bomoko s'adapte automatiquement à votre région.</p>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden animate-slideUp" style={{ animationDelay: '0.3s' }}>
                            <div className="px-8 py-6 border-b border-gray-50 bg-slate-50/50 flex items-center gap-4 font-black text-lg text-slate-900">
                                <Bell size={20} className="text-cdr-red" /> Notifications
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="space-y-6">
                                    <Toggle 
                                        name="notifEmail" 
                                        checked={formData.notifEmail} 
                                        label="Alertes Email" 
                                        desc="Nouvelles offres & formations" 
                                    />
                                    <Toggle 
                                        name="notifSms" 
                                        checked={formData.notifSms} 
                                        label="Alertes SMS" 
                                        desc="Urgences & Opportunités" 
                                    />
                                </div>
                                <div className="pt-6 border-t border-slate-50 flex items-center gap-3 text-slate-400">
                                    <Laptop size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Connecté sur votre appareil</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden animate-slideUp" style={{ animationDelay: '0.4s' }}>
                        <div className="px-10 py-8 border-b border-gray-50 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="flex items-center gap-4 font-black text-xl text-slate-900">
                                <ShieldCheck size={24} className="text-green-600" /> Sécurité du compte
                            </h2>
                        </div>
                        <div className="p-10 space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <button type="button" className="flex-1 flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 rounded-3xl transition group border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-2xl shadow-sm"><Lock size={20} className="text-slate-400 group-hover:text-cdr-blue transition-colors" /></div>
                                        <div className="text-left">
                                            <span className="block font-black text-slate-800">Modifier le mot de passe</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protéger votre accès</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={22} className="text-slate-300 group-hover:text-cdr-blue group-hover:translate-x-1 transition-all" />
                                </button>
                                
                                <div className="flex-1 p-6 bg-blue-50/30 border border-blue-100 rounded-3xl flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-2xl shadow-sm text-cdr-blue"><ShieldAlert size={20} /></div>
                                    <div>
                                        <span className="block font-black text-blue-900">Double Authentification</span>
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Bientôt disponible</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 mt-6 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-red-600 mb-6">
                                    <Trash2 size={20} />
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em]">Zone de danger</h3>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-red-50/50 border border-red-100 rounded-[2.5rem]">
                                    <div>
                                        <p className="font-black text-slate-900">Supprimer définitivement le compte</p>
                                        <p className="text-xs font-medium text-slate-500 mt-1">Action irréversible sur vos données.</p>
                                    </div>
                                    <button type="button" className="px-8 py-3 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-200 text-sm transform active:scale-95">
                                        Supprimer mon compte
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="sticky bottom-10 z-10 flex justify-center">
                        <div className="bg-slate-900/90 backdrop-blur-xl p-3 rounded-[2.5rem] shadow-2xl border border-white/10 flex gap-3">
                             <button 
                                type="submit" 
                                className="px-12 py-4 bg-cdr-blue text-white font-black rounded-[2rem] hover:bg-blue-600 transition flex items-center gap-4 shadow-xl shadow-blue-500/20 transform active:scale-95"
                            >
                                <Save size={20} /> {t('settings_save')}
                            </button>
                            <button 
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-8 py-4 bg-white/10 text-white font-black rounded-[2rem] hover:bg-white/20 transition text-sm"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
