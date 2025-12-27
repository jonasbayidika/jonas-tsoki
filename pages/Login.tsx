
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowLeft, Loader2, KeyRound, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<'login' | 'forgot'>('login');
  
  const { login, sendPasswordReset } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.message === 'EMAIL_NOT_VERIFIED') {
        navigate(`/verify-email-info?email=${encodeURIComponent(email)}`);
      } else {
        setError("password or email Incorrect");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return setError("Veuillez saisir votre adresse e-mail.");
      
      setIsSubmitting(true);
      setError('');
      try {
          await sendPasswordReset(email);
          alert("Un lien de réinitialisation a été envoyé à votre adresse e-mail.");
          setView('login');
      } catch (err: any) {
          setError("Impossible d'envoyer l'email de réinitialisation.");
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cdr-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cdr-yellow rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn border border-slate-100 relative z-10">
        <div className="bg-white p-8 pb-4 text-center relative">
          <button 
                onClick={() => view === 'login' ? navigate('/') : setView('login')} 
                className="absolute top-6 left-6 text-slate-400 hover:text-cdr-blue p-2 rounded-full hover:bg-slate-50 transition"
          >
              <ArrowLeft size={20} />
          </button>
          
          <Link to="/" className="inline-block mb-4 transform hover:scale-105 transition overflow-hidden">
            <img src="bomoko logo.png" alt="BOMOKO" className="h-16 w-auto object-contain mx-auto" />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {view === 'login' ? 'Connexion' : 'Récupération'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {view === 'login' ? 'Heureux de vous revoir sur BOMOKO.' : 'Entrez votre email pour réinitialiser votre accès.'}
          </p>
        </div>

        <div className="p-8 pt-4">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-shake">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-800 font-semibold">{error}</p>
            </div>
          )}

          {view === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cdr-blue focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    placeholder="votre@email.cd"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mot de passe</label>
                    <button type="button" onClick={() => setView('forgot')} className="text-xs text-cdr-blue hover:underline font-bold">
                        Oublié ?
                    </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cdr-blue focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cdr-blue text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <>Se connecter <ArrowRight size={20} /></>}
              </button>

              <div className="text-center pt-6">
                <p className="text-sm text-slate-600">
                  Pas encore de compte ?{' '}
                  <Link to="/signup" className="text-cdr-blue font-black hover:underline">
                    S'inscrire
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Votre E-mail</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                            <KeyRound size={18} />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-cdr-blue focus:border-transparent outline-none transition-all"
                            placeholder="votre@email.cd"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition shadow-xl"
                >
                    {isSubmitting ? 'Envoi...' : 'Réinitialiser'}
                </button>
                <button type="button" onClick={() => setView('login')} className="w-full text-slate-500 font-bold text-sm">Retour</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
