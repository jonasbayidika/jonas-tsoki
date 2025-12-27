
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Mail, Lock, AlertCircle, ArrowLeft, Phone, 
  User as UserIcon, Loader2, CheckCircle, 
  Camera, Upload, FileText, MapPin, 
  ChevronRight, Facebook, Linkedin, Twitter, GraduationCap,
  Building2, Globe
} from 'lucide-react';

type Step = 'role' | 'info' | 'media';

const Signup: React.FC = () => {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState<any>({
    name: '', postname: '', firstname: '', gender: 'M', email: '', phone: '', password: '',
    physicalAddress: '', subjectField: '', facebook: '', linkedin: '', twitter: '',
    companyName: '', city: '', country: 'RDC', website: '', activitySector: '',
    acceptTerms: false,
    avatar: '', idFront: '', idBack: '', cvFile: '', companyLogo: ''
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
    if (error) setError('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Le ficher est trop volumineux (max 5Mo).");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const compressed = await compressImage(base64);
        setFormData((prev: any) => ({ ...prev, [field]: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep1 = () => {
    const isEmailValid = emailRegex.test(formData.email.trim());
    const common = isEmailValid && formData.password && formData.password.length >= 6 && formData.acceptTerms;
    if (role === UserRole.CLIENT) return common && formData.name && formData.firstname && formData.phone;
    if (role === UserRole.FORMATEUR) return common && formData.name && formData.firstname && formData.phone && formData.subjectField && formData.physicalAddress;
    if (role === UserRole.PARTNER) return common && formData.companyName && formData.name && formData.activitySector;
    return false;
  };

  const validateFinal = () => {
    const hasIds = formData.idFront && formData.idBack;
    if (role === UserRole.CLIENT) return hasIds;
    if (role === UserRole.FORMATEUR) return hasIds && formData.cvFile;
    if (role === UserRole.PARTNER) return formData.companyLogo;
    return false;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    const cleanEmail = formData.email.trim();
    
    if (!emailRegex.test(cleanEmail)) {
        setError("L'adresse e-mail n'est pas valide.");
        setIsSubmitting(false);
        return;
    }

    try {
        await signup({ ...formData, email: cleanEmail, role }, formData.password);
        navigate(`/verify-email-info?email=${encodeURIComponent(cleanEmail)}`);
    } catch (err: any) {
        console.error("Signup error:", err);
        if (err.code === 'auth/email-already-in-use') {
            setError("Cet utilisateur existe déjà. Veuillez vous connecter.");
        } else if (err.message?.includes('exceeds the maximum allowed size')) {
            setError("Le dossier est trop lourd. Essayez de choisir des photos plus légères.");
        } else {
            setError("Une erreur technique est survenue lors de l'inscription.");
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cdr-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cdr-red rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-fadeIn border border-slate-100 relative z-10 my-8">
        <div className="bg-slate-900 p-8 text-white relative">
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={() => { if (step === 'info') setStep('role'); else if (step === 'media') setStep('info'); else navigate('/'); }} 
                    className="p-2 hover:bg-white/10 rounded-full transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <img src="bomoko logo.png" alt="BOMOKO" className="h-8 w-auto bg-white p-1 rounded-lg" />
            </div>
            
            <div className="flex justify-center gap-3 mb-4">
                <div className={`h-1.5 w-12 rounded-full ${step === 'role' ? 'bg-cdr-blue' : 'bg-slate-700'}`}></div>
                <div className={`h-1.5 w-12 rounded-full ${step === 'info' ? 'bg-cdr-blue' : 'bg-slate-700'}`}></div>
                <div className={`h-1.5 w-12 rounded-full ${step === 'media' ? 'bg-cdr-blue' : 'bg-slate-700'}`}></div>
            </div>

            <h2 className="text-2xl font-black text-center">
                {step === 'role' ? 'Sélection du profil' : 
                 step === 'info' ? 'Coordonnées & Identité' : 'Documents & Photos'}
            </h2>
        </div>

        <div className="p-8 md:p-10">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-800 font-bold">{error}</p>
              </div>
            )}

            {step === 'role' && (
                <div className="grid md:grid-cols-3 gap-6 animate-fadeIn">
                    <button onClick={() => { setRole(UserRole.CLIENT); setStep('info'); }} className="p-6 rounded-3xl border-2 border-slate-100 hover:border-cdr-blue hover:bg-blue-50 transition-all flex flex-col items-center text-center group">
                        <div className="w-14 h-14 bg-blue-100 text-cdr-blue rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><UserIcon size={28} /></div>
                        <h3 className="font-black text-slate-900 mb-1">Candidat</h3>
                        <p className="text-[10px] text-slate-500 leading-tight uppercase font-bold tracking-widest">Emploi & Formation</p>
                    </button>
                    <button onClick={() => { setRole(UserRole.FORMATEUR); setStep('info'); }} className="p-6 rounded-3xl border-2 border-slate-100 hover:border-cdr-yellow hover:bg-yellow-50 transition-all flex flex-col items-center text-center group">
                        <div className="w-14 h-14 bg-yellow-100 text-cdr-yellow rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><GraduationCap size={28} /></div>
                        <h3 className="font-black text-slate-900 mb-1">Formateur</h3>
                        <p className="text-[10px] text-slate-500 leading-tight uppercase font-bold tracking-widest">Partager son savoir</p>
                    </button>
                    <button onClick={() => { setRole(UserRole.PARTNER); setStep('info'); }} className="p-6 rounded-3xl border-2 border-slate-100 hover:border-cdr-red hover:bg-red-50 transition-all flex flex-col items-center text-center group">
                        <div className="w-14 h-14 bg-red-100 text-cdr-red rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Building2 size={28} /></div>
                        <h3 className="font-black text-slate-900 mb-1">Partenaire</h3>
                        <p className="text-[10px] text-slate-500 leading-tight uppercase font-bold tracking-widest">Entreprise & ONG</p>
                    </button>
                </div>
            )}

            {step === 'info' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                        {role !== UserRole.PARTNER ? (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Prénom</label>
                                    <input name="firstname" type="text" required value={formData.firstname} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cdr-blue outline-none" placeholder="Jean" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nom</label>
                                    <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cdr-blue outline-none" placeholder="Mukoko" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Sexe</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none bg-white">
                                        <option value="M">Masculin</option>
                                        <option value="F">Féminin</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Téléphone</label>
                                    <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cdr-blue outline-none" placeholder="+243..." />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nom de la structure / Entreprise</label>
                                    <input name="companyName" type="text" required value={formData.companyName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cdr-blue outline-none" placeholder="Dénomination sociale" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nom du responsable</label>
                                    <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cdr-blue outline-none" placeholder="Nom complet" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Secteur d'activité</label>
                                    <input name="activitySector" type="text" required value={formData.activitySector} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cdr-blue outline-none" placeholder="Tech, Éducation, Agrobusiness..." />
                                </div>
                            </>
                        )}

                        {role === UserRole.FORMATEUR && (
                            <>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Filière d'expertise</label>
                                    <input name="subjectField" type="text" required value={formData.subjectField} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cdr-blue outline-none" placeholder="Ex: Développement Web" />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Adresse Physique (Confidentiel)</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                        <input name="physicalAddress" type="text" required value={formData.physicalAddress} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cdr-blue outline-none" placeholder="Gombe, Kinshasa" />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="md:col-span-2 space-y-1 pt-2 border-t border-slate-100">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Identifiants de connexion</label>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="votre@email.cd" />
                                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Mot de passe (6+)" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-3">
                        <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="w-5 h-5 mt-0.5 text-cdr-blue rounded border-slate-300" />
                        <span className="text-xs text-slate-600 leading-relaxed font-medium">
                            J'accepte les <Link to="/about" className="text-cdr-blue font-black hover:underline">Termes et Conditions</Link>. Je certifie l'exactitude des informations.
                        </span>
                    </div>

                    <button type="button" onClick={() => setStep('media')} disabled={!validateStep1()} className="w-full bg-cdr-blue text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl">
                        Suivant <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {step === 'media' && (
                <div className="space-y-8 animate-fadeIn">
                    <div className="flex flex-col items-center">
                        <div onClick={() => document.getElementById('avatar-input')?.click()} className="w-32 h-32 bg-slate-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center cursor-pointer hover:bg-slate-200 transition group relative overflow-hidden">
                            {formData.avatar || formData.companyLogo ? (
                                <img src={formData.avatar || formData.companyLogo} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <Camera className="text-slate-400 group-hover:text-cdr-blue transition" size={36} />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold uppercase">Changer</div>
                        </div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mt-4">{role === UserRole.PARTNER ? 'Logo Structure' : 'Photo de Profil'}</label>
                        <input type="file" id="avatar-input" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, role === UserRole.PARTNER ? 'companyLogo' : 'avatar')} />
                    </div>

                    {role !== UserRole.PARTNER && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Recto (Face avant)</label>
                                <div onClick={() => document.getElementById('id-front')?.click()} className={`h-40 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all ${formData.idFront ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-cdr-blue'}`}>
                                    {formData.idFront ? <img src={formData.idFront} className="h-full w-full object-contain" alt="ID Front" /> : <Upload className="text-slate-400" />}
                                </div>
                                <input type="file" id="id-front" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'idFront')} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Verso (Face arrière)</label>
                                <div onClick={() => document.getElementById('id-back')?.click()} className={`h-40 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all ${formData.idBack ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-cdr-blue'}`}>
                                    {formData.idBack ? <img src={formData.idBack} className="h-full w-full object-contain" alt="ID Back" /> : <Upload className="text-slate-400" />}
                                </div>
                                <input type="file" id="id-back" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'idBack')} />
                            </div>
                        </div>
                    )}

                    {role === UserRole.FORMATEUR && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Votre CV (Image ou PDF)</label>
                            <div onClick={() => document.getElementById('cv-input')?.click()} className={`p-6 border-2 border-dashed rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${formData.cvFile ? 'border-cdr-yellow bg-yellow-50' : 'border-slate-200 hover:border-cdr-yellow'}`}>
                                <FileText className={formData.cvFile ? 'text-cdr-yellow' : 'text-slate-400'} size={32} />
                                <div className="text-left"><span className="font-bold text-sm text-slate-700 block">{formData.cvFile ? 'Document Importé' : 'Cliquez pour uploader'}</span><span className="text-[10px] text-slate-400 uppercase">Preuve de compétences</span></div>
                            </div>
                            <input type="file" id="cv-input" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'cvFile')} />
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button onClick={() => setStep('info')} className="flex-1 px-6 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition">Retour</button>
                        <button onClick={handleSubmit} disabled={isSubmitting || !validateFinal()} className="flex-[2] bg-cdr-blue text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-xl disabled:opacity-50">
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Finaliser l'inscription <CheckCircle size={20} /></>}
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-10 text-center border-t border-slate-100 pt-8">
                <p className="text-slate-600 font-medium">Déjà un compte ? <Link to="/login" className="text-cdr-blue font-black hover:underline">Se connecter</Link></p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
