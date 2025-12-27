
import React, { useState } from 'react';
import { 
  X, Smartphone, CreditCard, Loader2, CheckCircle2, 
  ShieldCheck, AlertCircle, Info, ArrowLeft, ChevronRight,
  Database
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemName: string;
  itemPrice: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, itemName, itemPrice }) => {
  const [step, setStep] = useState<'select' | 'form' | 'processing' | 'success'>('select');
  const [method, setMethod] = useState<'mpesa' | 'orange' | 'airtel' | 'africell' | 'card' | null>(null);
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleProcess = () => {
    setStep('processing');
    // Simulation appel API vers agrégateur (FlexPay, Faysal, etc.)
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2500);
  };

  const networks = [
    { id: 'mpesa', name: 'M-Pesa (Vodacom)', color: 'bg-green-600', text: 'text-green-600', icon: 'M' },
    { id: 'orange', name: 'Orange Money', color: 'bg-orange-500', text: 'text-orange-500', icon: 'O' },
    { id: 'airtel', name: 'Airtel Money', color: 'bg-red-600', text: 'text-red-600', icon: 'A' },
    { id: 'africell', name: 'Africell Money', color: 'bg-purple-600', text: 'text-purple-600', icon: 'Af' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-slideUp relative">
        
        {/* Header Paiement Professionnel */}
        <div className="bg-slate-900 p-8 text-white text-center relative">
            {step !== 'processing' && step !== 'success' && (
                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition"><X size={20}/></button>
            )}
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                {step === 'success' ? <CheckCircle2 size={32} className="text-green-400" /> : <ShieldCheck size={32} className="text-cdr-blue" />}
            </div>
            <h2 className="text-xl font-black">Finaliser mon paiement</h2>
            <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest leading-relaxed">
                {itemName}<br/>
                <span className="text-cdr-yellow">Transaction sécurisée • Bomoko RDC</span>
            </p>
        </div>

        <div className="p-8">
            {step === 'select' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-slate-600">Montant à payer</span>
                        <span className="text-2xl font-black text-cdr-blue">{itemPrice}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                         <div className="h-px bg-slate-100 flex-1"></div>
                         <span className="text-[9px] font-black uppercase tracking-widest">Mobile Money RDC</span>
                         <div className="h-px bg-slate-100 flex-1"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {networks.map(n => (
                            <button key={n.id} onClick={() => { setMethod(n.id as any); setStep('form'); }} className="p-4 border-2 border-slate-50 rounded-2xl hover:border-slate-900 hover:bg-slate-50 transition flex flex-col items-center gap-2 group">
                                <div className={`w-10 h-10 ${n.color} text-white rounded-xl flex items-center justify-center font-black shadow-md group-hover:scale-110 transition-transform`}>{n.icon}</div>
                                <span className="text-[10px] font-black uppercase text-slate-600">{n.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 mt-6 mb-2 text-slate-400">
                         <div className="h-px bg-slate-100 flex-1"></div>
                         <span className="text-[9px] font-black uppercase tracking-widest">Bancaire</span>
                         <div className="h-px bg-slate-100 flex-1"></div>
                    </div>

                    <button onClick={() => { setMethod('card'); setStep('form'); }} className="w-full p-4 border-2 border-slate-50 rounded-2xl hover:border-slate-900 hover:bg-slate-50 transition flex items-center justify-center gap-3">
                        <CreditCard size={20} className="text-slate-400" />
                        <span className="text-xs font-black uppercase text-slate-700 tracking-widest">Carte Visa / MasterCard</span>
                    </button>
                </div>
            )}

            {step === 'form' && (
                <div className="space-y-6 animate-fadeIn">
                    <button onClick={() => setStep('select')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase transition mb-4">
                        <ArrowLeft size={14}/> Retour aux options
                    </button>

                    {method === 'card' ? (
                        <div className="space-y-4">
                            <input type="text" placeholder="Nom complet (tel que sur la carte)" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                            <div className="relative">
                                <CreditCard className="absolute right-4 top-4 text-slate-300" />
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="MM/YY" className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                                <input type="password" placeholder="CVC" className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
                                <div className={`w-10 h-10 ${networks.find(n => n.id === method)?.color} text-white rounded-xl flex items-center justify-center font-black`}>{networks.find(n => n.id === method)?.icon}</div>
                                <div className="text-xs font-black uppercase text-slate-600">{networks.find(n => n.id === method)?.name}</div>
                            </div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase ml-1">Numéro de téléphone ({networks.find(n => n.id === method)?.name})</label>
                            <input 
                                type="tel" 
                                placeholder="+243..." 
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black text-lg tracking-wider focus:ring-2 focus:ring-slate-900" 
                            />
                        </div>
                    )}

                    <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-2xl border border-blue-100">
                        <Database size={20} className="shrink-0 mt-0.5 text-blue-600" />
                        <p className="text-[10px] font-bold leading-tight uppercase">
                            Après paiement, l'accès sera inscrit de façon permanente dans la base de données Firebase Bomoko.
                        </p>
                    </div>

                    <button onClick={handleProcess} className="w-full py-5 bg-cdr-blue text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-100 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                        Confirmer le paiement ({itemPrice}) <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {step === 'processing' && (
                <div className="py-16 text-center animate-fadeIn">
                    <Loader2 size={64} className="text-cdr-blue animate-spin mx-auto mb-8" />
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Synchronisation Database</h3>
                    <p className="text-slate-500 font-medium">Veuillez valider le message USSD sur votre téléphone...</p>
                </div>
            )}

            {step === 'success' && (
                <div className="py-16 text-center animate-fadeIn">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100">
                        <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2">Accès Débloqué !</h3>
                    <p className="text-slate-500 font-medium mb-4">Votre transaction est enregistrée sur Firebase.</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-200">
                        <ShieldCheck size={12} /> Utilisateur Autorisé
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
