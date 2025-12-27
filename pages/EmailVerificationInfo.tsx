
import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EmailVerificationInfo: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resendVerificationEmail } = useAuth();
  const query = new URLSearchParams(location.search);
  const email = query.get('email') || "votre adresse e-mail";

  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerificationEmail();
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10 text-center animate-fadeIn border border-slate-100">
        <div className="w-24 h-24 bg-blue-50 text-cdr-blue rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Mail size={48} />
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Vérifiez votre boîte mail</h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Nous vous avons envoyé un e-mail de vérification à <span className="font-bold text-slate-900">{email}</span>. 
          Veuillez cliquer sur le lien dans le message pour activer votre compte BOMOKO.
        </p>

        <div className="space-y-4">
          <Link 
            to="/login" 
            className="w-full bg-cdr-blue text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group"
          >
            Aller à la connexion <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <button 
            onClick={handleResend}
            disabled={isResending || resent}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition ${resent ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            {resent ? (
              <><CheckCircle size={18} /> E-mail renvoyé !</>
            ) : (
              <><RefreshCw size={18} className={isResending ? 'animate-spin' : ''} /> Renvoyer l'e-mail</>
            )}
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="text-slate-400 font-bold text-sm flex items-center justify-center gap-2 mx-auto hover:text-slate-600 transition pt-4"
          >
            <ArrowLeft size={16} /> Retour à l'accueil
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-50">
          <p className="text-xs text-slate-400 font-medium">
            Vous ne trouvez pas l'e-mail ? Vérifiez vos courriers indésirables (spams).
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationInfo;
