
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Phone, MapPin, Edit2, Shield, Award, LogOut, Camera, Settings as SettingsIcon, X, Check, RotateCw, ZoomIn, ArrowLeft, Clock, AlertTriangle, Trash2, Loader2, Upload, FileCheck, ShieldAlert, ShieldCheck, CheckCircle, Smartphone, Fingerprint } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const Profile: React.FC = () => {
    const { user, logout, updateProfile, submitCertification } = useAuth();
    const [activeTab, setActiveTab] = useState('infos');
    const navigate = useNavigate();
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const idFrontRef = useRef<HTMLInputElement>(null);
    const idBackRef = useRef<HTMLInputElement>(null);

    // États certification
    const [idFront, setIdFront] = useState<string | null>(user?.idDocuments?.front || null);
    const [idBack, setIdBack] = useState<string | null>(user?.idDocuments?.back || null);
    const [isSubmittingCert, setIsSubmittingCert] = useState(false);

    // États éditeur avatar
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const imageRef = useRef<HTMLImageElement>(null);

    const compressImage = (base64: string, maxWidth = 800, quality = 0.6): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxWidth) {
                        width *= maxWidth / height;
                        height = maxWidth;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const compressed = await compressImage(base64);
                setter(compressed);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitCert = async () => {
        if (!idFront || !idBack) return;
        setIsSubmittingCert(true);
        try {
            await submitCertification(idFront, idBack);
            setActiveTab('certif');
            alert("Vos documents ont été soumis avec succès ! Nos services de sécurité procèdent à la vérification manuelle (24-48h).");
        } catch (err: any) {
            if (err.message?.includes('exceeds the maximum allowed size')) {
                alert("Erreur : Le dossier est trop lourd. Veuillez choisir des photos plus simples.");
            } else {
                alert("Erreur lors de la soumission. Veuillez réessayer.");
            }
        } finally {
            setIsSubmittingCert(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const handleAvatarClick = () => avatarInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImageSrc(reader.result as string);
                setIsEditorOpen(true);
                setScale(1); setRotation(0); setPosition({ x: 0, y: 0 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveAvatar = async () => {
        if (!tempImageSrc || !imageRef.current) return;
        const canvas = document.createElement('canvas');
        const size = 300; canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, size, size);
            ctx.translate(size / 2, size / 2); ctx.rotate((rotation * Math.PI) / 180);
            ctx.scale(scale, scale); ctx.translate(position.x / scale, position.y / scale);
            const img = imageRef.current;
            const ratio = Math.max(size / img.naturalWidth, size / img.naturalHeight);
            ctx.drawImage(img, -img.naturalWidth * ratio / 2, -img.naturalHeight * ratio / 2, img.naturalWidth * ratio, img.naturalHeight * ratio);
            
            // On sauvegarde en JPEG 0.7 pour être sûr du poids
            const result = canvas.toDataURL('image/jpeg', 0.7);
            await updateProfile({ avatar: result });
            setIsEditorOpen(false);
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-cdr-blue" size={48} /></div>;

    const isAgent = user.role === UserRole.AGENT;

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-cdr-blue transition mb-8 font-bold">
                    <ArrowLeft size={20} /> Retour au portail
                </button>

                <div className="grid lg:grid-cols-12 gap-8">
                    
                    {/* Sidebar Profil */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                             <div className="h-24 bg-gradient-to-r from-cdr-blue to-blue-700"></div>
                             <div className="px-6 pb-6 -mt-12 text-center">
                                <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-xl mx-auto relative group cursor-pointer" onClick={handleAvatarClick}>
                                    <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-3xl overflow-hidden border border-slate-100">
                                        {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Camera size={24} className="text-white" /></div>
                                    <input type="file" ref={avatarInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                </div>
                                <h2 className="text-xl font-extrabold text-slate-900 mt-4 flex items-center justify-center gap-2">
                                    {user.name} {user.postname}
                                    {(user.isCertified || user.certificationStatus === 'certified') && <ShieldCheck size={20} className="text-green-500 fill-green-50" />}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium">{user.email}</p>
                                
                                <div className="flex flex-wrap justify-center gap-2 mt-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${isAgent ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-cdr-blue'}`}>
                                        {isAgent ? 'Profil Prestataire' : 'Profil Candidat'}
                                    </span>
                                    {user.certificationStatus === 'pending' && <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 uppercase tracking-wider animate-pulse">Vérification en cours</span>}
                                </div>
                             </div>
                             
                             <div className="p-2 space-y-1">
                                <button onClick={() => setActiveTab('infos')} className={`w-full text-left px-4 py-3 rounded-2xl font-bold flex items-center gap-3 transition ${activeTab === 'infos' ? 'bg-blue-50 text-cdr-blue' : 'text-slate-600 hover:bg-slate-50'}`}><UserIcon size={18} /> Mes Informations</button>
                                <button onClick={() => setActiveTab('certif')} className={`w-full text-left px-4 py-3 rounded-2xl font-bold flex items-center gap-3 transition ${activeTab === 'certif' ? 'bg-blue-50 text-cdr-blue' : 'text-slate-600 hover:bg-slate-50'}`}><Award size={18} /> Statut de Certification</button>
                                {isAgent && user.certificationStatus !== 'certified' && (
                                    <button onClick={() => setActiveTab('kyc')} className={`w-full text-left px-4 py-3 rounded-2xl font-bold flex items-center gap-3 transition ${activeTab === 'kyc' ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-50'}`}><Fingerprint size={18} /> Vérifier mon Identité</button>
                                )}
                                <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-3 rounded-2xl font-bold flex items-center gap-3 text-slate-600 hover:bg-slate-50"><SettingsIcon size={18} /> Paramètres</button>
                                <div className="pt-2">
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-2xl font-bold flex items-center gap-3 text-red-500 hover:bg-red-50 transition"><LogOut size={18} /> Déconnexion</button>
                                </div>
                             </div>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg">
                            <h4 className="font-bold flex items-center gap-2 mb-3"><Shield size={18} className="text-cdr-yellow" /> Sécurité des données</h4>
                            <p className="text-slate-400 text-xs leading-relaxed">Vos documents d'identité sont cryptés et stockés sur des serveurs sécurisés conformes aux normes internationales.</p>
                        </div>
                    </div>

                    {/* Zone de Contenu */}
                    <div className="lg:col-span-8">
                        {activeTab === 'infos' && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-fadeIn">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-extrabold text-2xl text-slate-900">Informations Personnelles</h3>
                                    <button onClick={() => navigate('/settings')} className="text-cdr-blue font-bold text-sm flex items-center gap-1 hover:underline"><Edit2 size={14} /> Modifier</button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm text-cdr-blue"><Mail size={20} /></div>
                                        <div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Email</div><div className="font-bold text-slate-700">{user.email}</div></div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm text-cdr-blue"><Phone size={20} /></div>
                                        <div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Téléphone</div><div className="font-bold text-slate-700">{user.phone || 'Non renseigné'}</div></div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm text-cdr-blue"><MapPin size={20} /></div>
                                        <div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Localisation</div><div className="font-bold text-slate-700">{user.location || 'Kinshasa, RDC'}</div></div>
                                    </div>
                                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                        <h4 className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2">Bio</h4>
                                        <p className="text-slate-700 text-sm italic leading-relaxed">{user.bio || "Jeune talent motivé cherchant des opportunités sur BOMOKO."}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'certif' && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-fadeIn">
                                <h3 className="font-extrabold text-2xl text-slate-900 mb-6">État du Compte</h3>
                                
                                {user.certificationStatus === 'certified' ? (
                                    <div className="bg-green-50 text-green-800 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 border border-green-200">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-green-100">
                                                <ShieldCheck size={56} className="text-green-600" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-green-600 text-white p-1 rounded-full"><CheckCircle size={20} /></div>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <h4 className="font-black text-xl mb-2">Profil Officiellement Certifié</h4>
                                            <p className="text-sm opacity-90 leading-relaxed mb-4">Votre identité a été validée par nos services. Vous avez désormais un accès illimité aux fonctionnalités premium de la marketplace et du recrutement.</p>
                                            <div className="flex gap-3 justify-center md:justify-start">
                                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full border border-green-200 uppercase">Audit réussi</span>
                                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full border border-green-200 uppercase">Identité vérifiée</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : user.certificationStatus === 'pending' ? (
                                    <div className="bg-yellow-50 text-yellow-800 p-8 rounded-3xl flex items-center gap-6 border border-yellow-200">
                                        <Clock size={48} className="text-yellow-600 shrink-0" />
                                        <div>
                                            <h4 className="font-extrabold text-lg mb-1">Vérification en cours</h4>
                                            <p className="text-sm opacity-90">Nos agents examinent actuellement vos documents. Ce processus prend généralement moins de 48 heures. Vous recevrez une notification par email dès validation.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 border-2 border-dashed border-slate-300">
                                            <ShieldAlert size={40} />
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-800 mb-2">Compte Standard</h4>
                                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                            Pour vendre des produits ou offrir des services sur BOMOKO, vous devez d'abord certifier votre profil avec une pièce d'identité valide.
                                        </p>
                                        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                                             <button onClick={() => navigate('/subscription')} className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition shadow-xl">Explorer les Plans Pro</button>
                                             {isAgent && <button onClick={() => setActiveTab('kyc')} className="px-6 py-4 bg-cdr-blue text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-xl">Vérifier mon ID</button>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'kyc' && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-fadeIn">
                                <div className="mb-8">
                                    <h3 className="font-extrabold text-2xl text-slate-900 mb-2">Certification de l'Identité</h3>
                                    <p className="text-slate-500 text-sm">Veuillez télécharger des photos nettes et lisibles de votre Carte d'Électeur ou Passeport.</p>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    {/* Recto */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recto (Face avant)</label>
                                        <div 
                                            onClick={() => idFrontRef.current?.click()}
                                            className={`h-56 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${idFront ? 'border-green-500 bg-green-50/50' : 'border-slate-200 hover:border-cdr-blue hover:bg-blue-50/30'}`}
                                        >
                                            {idFront ? (
                                                <img src={idFront} alt="ID Front" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 mb-3"><Upload size={24} /></div>
                                                    <span className="text-xs font-bold text-slate-600">Ajouter le Recto</span>
                                                </>
                                            )}
                                            <input type="file" ref={idFrontRef} onChange={(e) => handleFileUpload(e, setIdFront)} className="hidden" accept="image/*" />
                                        </div>
                                    </div>

                                    {/* Verso */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verso (Face arrière)</label>
                                        <div 
                                            onClick={() => idBackRef.current?.click()}
                                            className={`h-56 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${idBack ? 'border-green-500 bg-green-50/50' : 'border-slate-200 hover:border-cdr-blue hover:bg-blue-50/30'}`}
                                        >
                                            {idBack ? (
                                                <img src={idBack} alt="ID Back" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 mb-3"><Upload size={24} /></div>
                                                    <span className="text-xs font-bold text-slate-600">Ajouter le Verso</span>
                                                </>
                                            )}
                                            <input type="file" ref={idBackRef} onChange={(e) => handleFileUpload(e, setIdBack)} className="hidden" accept="image/*" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start gap-4 mb-8">
                                    <div className="p-2 bg-blue-100 text-cdr-blue rounded-xl"><Smartphone size={20} /></div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Conseil : Assurez-vous que les 4 coins de votre document sont visibles et que les textes sont parfaitement lisibles. Les reflets de flash peuvent invalider la vérification.
                                    </p>
                                </div>

                                <button 
                                    onClick={handleSubmitCert}
                                    disabled={!idFront || !idBack || isSubmittingCert}
                                    className="w-full py-4 bg-cdr-blue text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isSubmittingCert ? <Loader2 className="animate-spin" /> : <>Soumettre mon dossier de certification <CheckCircle size={20} /></>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Avatar Editor */}
            {isEditorOpen && tempImageSrc && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-slate-900 text-white p-5 flex justify-between items-center"><h3 className="font-bold">Ajuster votre photo</h3><button onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-white p-2"><X size={24} /></button></div>
                        <div className="p-8 text-center">
                            <div className="relative w-full h-64 bg-slate-100 rounded-3xl overflow-hidden cursor-move mb-8 border-2 border-slate-100" onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); }} onMouseMove={(e) => { if (isDragging) setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)}>
                                <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"><div className="w-56 h-56 rounded-3xl border-4 border-white shadow-[0_0_0_999px_rgba(0,0,0,0.4)]"></div></div>
                                <img ref={imageRef} src={tempImageSrc} style={{ transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})` }} className="max-w-none pointer-events-none select-none" alt="" />
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4"><ZoomIn size={20} className="text-slate-400" /><input type="range" min="1" max="3" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cdr-blue" /></div>
                                <div className="flex justify-between items-center gap-4"><button onClick={() => setRotation(r => r + 90)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition font-bold text-sm"><RotateCw size={18} /> Rotation</button><button onClick={handleSaveAvatar} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-cdr-blue text-white rounded-xl hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-100 text-sm"><Check size={18} /> Enregistrer</button></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
