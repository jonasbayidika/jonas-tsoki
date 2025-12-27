
import React, { useState, useEffect } from 'react';
import { Community } from '../types';
import { 
    Users, Check, PlusCircle, X, Globe, 
    ArrowLeft, Plus, CheckCircle, Loader2, Sparkles, Image as ImageIcon, Upload, Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Communities: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('Tous');
    const [communities, setCommunities] = useState<Community[]>([]);
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
    
    // Create Community States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newCommunity, setNewCommunity] = useState({
        name: '',
        type: 'Association',
        description: '',
        image: '' // Base64
    });

    const loadCommunities = () => {
        const storedComm = localStorage.getItem('bomoko_communities');
        if (storedComm) {
            setCommunities(JSON.parse(storedComm));
        } else {
            const initial = [
                { id: '1', name: 'Les Jeunes Entrepreneurs de Kinshasa', type: 'Association', membersCount: 1250, description: 'Réseau d\'entraide pour les jeunes porteurs de projets dans la capitale.', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800', isMember: false },
                { id: '2', name: 'Codeurs du Congo', type: 'ONG', membersCount: 840, description: 'Promouvoir l\'excellence technologique par l\'apprentissage du code.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800', isMember: false }
            ];
            setCommunities(initial);
            localStorage.setItem('bomoko_communities', JSON.stringify(initial));
        }
    };

    useEffect(() => {
        loadCommunities();
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCommunity(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateCommunity = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCommunity.name || !newCommunity.description || !newCommunity.image) return;
        
        setIsSubmitting(true);
        // Fix: Renamed 'creatorId' to 'protectorId' to match the Community interface definition in types.ts
        const freshCommunity: Community = {
            id: Date.now().toString(),
            name: newCommunity.name,
            type: newCommunity.type,
            description: newCommunity.description,
            membersCount: 1,
            image: newCommunity.image,
            isMember: true,
            protectorId: user?.id || 'anonymous'
        };

        setTimeout(() => {
            const updated = [freshCommunity, ...communities];
            setCommunities(updated);
            localStorage.setItem('bomoko_communities', JSON.stringify(updated));
            setIsSubmitting(false);
            setIsCreateModalOpen(false);
            setNewCommunity({ name: '', type: 'Association', description: '', image: '' });
        }, 1500);
    };

    const handleJoin = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation(); 
        if (!user) { navigate('/login'); return; }

        const updatedCommunities = communities.map(c => 
            c.id === id ? { ...c, isMember: !c.isMember, membersCount: c.isMember ? c.membersCount - 1 : c.membersCount + 1 } : c
        );

        setCommunities(updatedCommunities);
        localStorage.setItem('bomoko_communities', JSON.stringify(updatedCommunities));
        if (selectedCommunity && selectedCommunity.id === id) {
            setSelectedCommunity(prev => prev ? { ...prev, isMember: !prev.isMember, membersCount: prev.isMember ? prev.membersCount - 1 : prev.membersCount + 1 } : null);
        }
    };

    const filtered = communities.filter(c => filter === 'Tous' || c.type === filter);

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4">
            <div className="max-w-6xl mx-auto">
                 <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cdr-blue transition mb-8 font-bold"><ArrowLeft size={20} /> Retour</button>

                 <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Communautés & Clubs</h1>
                        <p className="text-slate-500 font-medium mt-1">Rejoignez des groupes d'impact en RDC.</p>
                    </div>
                    <button onClick={() => user ? setIsCreateModalOpen(true) : navigate('/login')} className="bg-cdr-blue text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition flex items-center gap-3 shadow-xl shadow-blue-100 uppercase tracking-widest text-xs">
                        <PlusCircle size={20} /> Créer un club
                    </button>
                </div>

                <div className="flex overflow-x-auto gap-3 mb-10 pb-2 scrollbar-hide">
                    {['Tous', 'ONG', 'Église', 'Association', 'Entreprise', 'Sport', 'Tech'].map(type => (
                        <button key={type} onClick={() => setFilter(type)} className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === type ? 'bg-cdr-blue text-white shadow-lg shadow-blue-100' : 'bg-white text-slate-500 border border-slate-200 hover:border-cdr-blue'}`}>{type}</button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6 pb-20">
                    {filtered.map(community => (
                        <div key={community.id} onClick={() => setSelectedCommunity(community)} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-8 hover:shadow-xl transition-all duration-500 cursor-pointer group">
                            <div className="relative">
                                <img src={community.image} alt={community.name} className="w-24 h-24 rounded-[2rem] object-cover border-4 border-slate-50 shadow-sm group-hover:scale-105 transition-transform duration-500" />
                                {community.isMember && <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow-md"><Check size={14} /></div>}
                            </div>
                            <div className="flex-1 text-center sm:text-left min-w-0">
                                <div className="flex flex-col sm:flex-row items-center gap-2 mb-2">
                                    <h3 className="text-xl font-black text-slate-800 truncate leading-none">{community.name}</h3>
                                    <span className="text-[8px] font-black px-2 py-1 rounded bg-blue-50 text-cdr-blue uppercase tracking-widest shrink-0">{community.type}</span>
                                </div>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2 font-medium leading-relaxed">{community.description}</p>
                                <div className="flex items-center justify-center sm:justify-start gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                    <span className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg"><Users size={12} className="text-cdr-blue" /> {community.membersCount} membres</span>
                                </div>
                            </div>
                            <button onClick={(e) => handleJoin(community.id, e)} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition shadow-lg shrink-0 ${community.isMember ? 'bg-green-50 text-green-700 hover:bg-green-100 shadow-green-50' : 'bg-slate-900 text-white hover:bg-cdr-blue shadow-slate-100'}`}>{community.isMember ? 'Inscrit' : 'Rejoindre'}</button>
                        </div>
                    ))}
                </div>

                {/* MODAL CRÉATION */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn" onClick={() => !isSubmitting && setIsCreateModalOpen(false)}>
                        <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col animate-slideUp" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-cdr-blue p-8 text-white flex justify-between items-center relative shrink-0">
                                <h2 className="text-2xl font-black">Lancer une Communauté</h2>
                                <button onClick={() => setIsCreateModalOpen(false)} disabled={isSubmitting} className="p-2 hover:bg-white/10 rounded-full transition"><X size={28} /></button>
                            </div>
                            <form onSubmit={handleCreateCommunity} className="flex-1 overflow-y-auto p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nom du club</label><input required type="text" value={newCommunity.name} onChange={e => setNewCommunity({...newCommunity, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" placeholder="Ex: Les Jeunes Tech de Goma" /></div>
                                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Catégorie</label><select value={newCommunity.type} onChange={e => setNewCommunity({...newCommunity, type: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold appearance-none cursor-pointer"><option value="Association">Association</option><option value="ONG">ONG</option><option value="Tech">Tech</option><option value="Sport">Sport</option></select></div>
                                    <div className="space-y-1.5"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description</label><textarea required rows={3} value={newCommunity.description} onChange={e => setNewCommunity({...newCommunity, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium resize-none" placeholder="Quelle est votre mission ?"></textarea></div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Image de couverture</label>
                                        <div onClick={() => document.getElementById('comm-img-upload')?.click()} className={`h-40 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${newCommunity.image ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-cdr-blue'}`}>
                                            {newCommunity.image ? <img src={newCommunity.image} className="w-full h-full object-cover" alt="Preview" /> : <><Upload size={32} className="text-slate-300 mb-2" /><span className="text-[10px] font-black text-slate-400 uppercase">Importer une photo</span></>}
                                        </div>
                                        <input id="comm-img-upload" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </div>
                                </div>
                                <button type="submit" disabled={isSubmitting || !newCommunity.image} className="w-full py-5 bg-cdr-blue text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl disabled:opacity-50 uppercase tracking-widest text-xs">
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><PlusCircle size={20} className="inline mr-2" /> Créer le club</>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL DÉTAIL */}
                {selectedCommunity && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedCommunity(null)}>
                        <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-slideUp relative" onClick={(e) => e.stopPropagation()}>
                            <div className="h-48 bg-slate-900 relative"><img src={selectedCommunity.image} className="w-full h-full object-cover opacity-60" alt="" /><div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div><button onClick={() => setSelectedCommunity(null)} className="absolute top-6 right-6 bg-black/20 hover:bg-black/50 text-white p-2 rounded-full transition backdrop-blur-md"><X size={24} /></button></div>
                            <div className="px-10 pb-10 -mt-16 relative">
                                <div className="flex justify-between items-end mb-8">
                                    <img src={selectedCommunity.image} alt={selectedCommunity.name} className="w-32 h-32 rounded-[2.5rem] border-8 border-white shadow-xl bg-white object-cover" />
                                    <button onClick={() => handleJoin(selectedCommunity.id)} className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${selectedCommunity.isMember ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-cdr-blue text-white hover:bg-blue-700'}`}>{selectedCommunity.isMember ? 'Déjà Membre' : 'Rejoindre'}</button>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedCommunity.name}</h2>
                                <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-cdr-blue text-[10px] font-black uppercase tracking-widest mb-6">{selectedCommunity.type}</div>
                                <p className="text-slate-600 leading-relaxed font-medium mb-6">{selectedCommunity.description}</p>
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4"><Info size={20} className="text-cdr-blue" /><p className="text-xs font-bold text-slate-600 uppercase">Ce groupe est modéré par Bomoko Jeunesse Congo.</p></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Communities;
