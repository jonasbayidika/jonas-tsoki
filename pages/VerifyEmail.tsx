import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MailCheck, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmailCode } = useAuth();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const mode = query.get('mode');
    const oobCode = query.get('oobCode');

    if (mode === 'verifyEmail' && oobCode) {
      handleVerification(oobCode);
    } else {
      setStatus('error');
      setErrorMsg("Lien de vérification invalide ou mal formé.");
    }
  }, [location]);

  const handleVerification = async (code: string) => {
    try {
      await verifyEmailCode(code);
      setStatus('success');
      // On peut rediriger après un délai ou laisser l'utilisateur cliquer
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center animate-fadeIn">
        
        {status === 'loading' && (
          <div className="py-8">
            <Loader2 size={48} className="text-cdr-blue animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Vérification en cours</h2>
            <p className="text-slate-500">Nous validons votre adresse e-mail...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8 animate-slideUp">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Email vérifié !</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Félicitations, votre compte est désormais actif. Vous pouvez maintenant accéder à toutes les fonctionnalités de BOMOKO.
            </p>
            <Link 
              to="/login" 
              className="w-full bg-cdr-blue text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              Se connecter <ArrowRight size={20} />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8 animate-slideUp">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Échec de vérification</h2>
            <p className="text-red-600 mb-8 font-medium">
              {errorMsg}
            </p>
            <div className="space-y-4">
                <Link 
                    to="/login" 
                    className="block w-full bg-cdr-blue text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Retour à la connexion
                </Link>
                <p className="text-sm text-slate-500">
                    Si le problème persiste, essayez de demander un nouvel email de vérification depuis l'écran de connexion.
                </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;