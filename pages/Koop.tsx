
import React, { useState, useEffect } from 'react';
import { Classified, UserRole } from '../types';
import { 
  Search, MapPin, PlusCircle, X, MessageSquare, 
  Phone, Calendar, ShieldCheck, Crown, 
  Check, Loader2, ArrowLeft, Camera, 
  Trash2, CheckCircle2, ShoppingBag, Zap, Box
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';

const Koop: React.FC = () => {
    const { user } = useAuth();
    const { startConversation } = useChat();
    const navigate = useNavigate();
    
    const [items, setItems] = useState<Classified[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('Tous');
    const [selectedItem, setSelectedItem] = useState<Classified | null>(null);
    
    // Form States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newItem, setNewItem] = useState({
        title: '',
        price: '',
        category: 'Électronique',
        location: '',
        description: '',
        condition: 'Neuf' as 'Neuf' | 'Occasion',
        images: [] as string[]
    });

    useEffect(() => {
        const storedItems = localStorage.getItem('bomoko_koop');
        if (storedItems) {
            setItems(JSON.parse(storedItems));
        } else {
            const initial = [
                {
                    id: '1',
                    title: 'iPhone 15 Pro Max 256GB',
                    price: '1200$',
                    category: 'Électronique',
                    description: 'Téléphone en parfait état, vendu avec chargeur original. Jamais ouvert.',
                    location: 'Kinshasa, Gombe',
                    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
                    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800'],
                    sellerId: 'demo',
                    sellerName: 'Boutique Apple Kin',
                    date: 'Aujourd\'hui',
                    condition: 'Occasion' as const,
                    isSold: false
                }
            ];
            setItems(initial);
            localStorage.setItem('bomoko_koop', JSON.stringify(initial));
        }
    }, []);

    const filteredItems = items.filter(item => 
        (category === 'Tous' || item.category === category) &&
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItem(prev => ({
                    ...prev,
                    images: [...prev.images, reader.result as string].slice(0, 5)
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setNewItem(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handlePublishSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.images.length === 0) {
            alert("Veuillez ajouter au moins une photo.");
            return;
        }

        setIsSubmitting(true);
        const newAd: Classified = {
            id: Date.now().toString(),
            title: newItem.title,
            price: newItem.price.includes('$') ? newItem.price : `${newItem.price}$`,
            category: newItem.category,
            description: newItem.description,
            condition: newItem.condition,
            location: newItem.location || user?.location || 'Kinshasa',
            image: newItem.images[0],
            images: newItem.images,
            sellerId: user?.id || 'unknown',
            sellerName: user?.firstname + ' ' + user?.name || 'Vendeur Bomoko',
            date: "À l'instant",
            isSold: false
        };

        const updatedItems = [newAd, ...items];
        setItems(updatedItems);
        localStorage.setItem('bomoko_koop', JSON.stringify(updatedItems));
        
        setTimeout(() => {
            setIsSubmitting(false);
            setIsAddModalOpen(false);
            setNewItem({ title: '', price: '', category: 'Électronique', location: '', description: '', condition: 'Neuf', images: [] });
            alert("Votre article est en ligne et visible par tous les membres !");
        }, 1000);
    };

    const toggleSoldStatus = (itemId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = items.map(item => 
            item.id === itemId ? { ...item, isSold: !item.isSold } : item
        );
        setItems(updated);
        localStorage.setItem('bomoko_koop', JSON.stringify(updated));
        if (selectedItem?.id === itemId) {
            setSelectedItem(prev => prev ? { ...prev, isSold: !prev.isSold } : null);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cdr-green transition mb-6 font-bold">
                    <ArrowLeft size={20} /> Retour
                </button>

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                            <ShoppingBag className="text-cdr-green" size={36} /> KOOP Market
                        </h1>
                        <p className="text-slate-500 font-medium">Le marché de confiance ouvert à toute la communauté Bomoko.</p>
                    </div>
                    
                    <button onClick={() => user ? setIsAddModalOpen(true) : navigate('/login')} className="px-8 py-4 bg-cdr-green text-white font-black rounded-2xl hover:bg-green-700 transition flex items-center gap-3 shadow-xl">
                         <PlusCircle size={22} /> Vendre un article
                    </button>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 mb-10 flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Rechercher un article..." 
                            className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cdr-green font-medium transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cdr-green font-bold text-sm text-slate-700 cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Tous">Toutes Catégories</option>
                        <option value="Électronique">Électronique</option>
                        <option value="Mode">Mode</option>
                        <option value="Immobilier">Immobilier</option>
                        <option value="Véhicules">Véhicules</option>
                        <option value="Divers">Divers</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredItems.map(item => (
                        <div key={item.id} onClick={() => setSelectedItem(item)} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer flex flex-col relative">
                            {item.isSold && (
                                <div className="absolute top-4 -right-8 bg-red-600 text-white px-10 py-1 rotate-45 text-[10px] font-black uppercase z-20 shadow-md">Vendu</div>
                            )}
                            {!item.isSold && (
                                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase z-20 shadow-sm">Disponible</div>
                            )}
                            <div className="h-64 overflow-hidden relative">
                                <img src={item.image} alt={item.title} className={`w-full h-full object-cover group-hover:scale-110 transition duration-700 ${item.isSold ? 'grayscale' : ''}`} />
                                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black text-cdr-green shadow-sm">{item.price}</div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="font-black text-slate-800 text-lg mb-2 group-hover:text-cdr-green transition-colors leading-tight line-clamp-2">{item.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mb-4"><MapPin size={14} className="text-cdr-red" /> {item.location}</div>
                                <div className="mt-auto flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    <span>{item.sellerName}</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn" onClick={() => !isSubmitting && setIsAddModalOpen(false)}>
                        <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-slideUp" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-cdr-green p-8 text-white flex justify-between items-center shrink-0">
                                <h2 className="text-2xl font-black">Mettre en vente un produit</h2>
                                <button onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting} className="p-2 hover:bg-white/10 rounded-full transition"><X size={28} /></button>
                            </div>

                            <form onSubmit={handlePublishSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom du produit</label>
                                            <input required type="text" placeholder="Ex: Mac Book Pro 2022" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prix ($)</label>
                                                <input required type="number" placeholder="500" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-cdr-green" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">État</label>
                                                <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={newItem.condition} onChange={e => setNewItem({...newItem, condition: e.target.value as any})}>
                                                    <option value="Neuf">Neuf</option>
                                                    <option value="Occasion">Occasion</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Localisation</label>
                                            <input required type="text" placeholder="Kinshasa, Limete" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Photos (Max 5)</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {newItem.images.map((img, i) => (
                                                    <div key={i} className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative group">
                                                        <img src={img} className="w-full h-full object-cover" />
                                                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full"><Trash2 size={12}/></button>
                                                    </div>
                                                ))}
                                                {newItem.images.length < 5 && (
                                                    <button type="button" onClick={() => document.getElementById('item-images')?.click()} className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-cdr-green transition">
                                                        <Camera size={24} />
                                                        <span className="text-[8px] font-bold mt-1">AJOUTER</span>
                                                    </button>
                                                )}
                                            </div>
                                            <input id="item-images" type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                            <textarea required rows={4} placeholder="Détails techniques, raisons de la vente..." className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium resize-none" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-cdr-green text-white font-black rounded-2xl hover:bg-green-700 transition flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl">
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <>Publier mon annonce <Zap size={20} /></>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {selectedItem && (
                    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedItem(null)}>
                        <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden grid md:grid-cols-2 animate-slideUp" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-slate-100 relative">
                                <img src={selectedItem.image} alt={selectedItem.title} className={`w-full h-full object-cover transition-all duration-700 ${selectedItem.isSold ? 'grayscale' : ''}`} />
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
                                    {selectedItem.images?.map((img, i) => (
                                        <img key={i} src={img} className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-all" onClick={() => setSelectedItem({...selectedItem, image: img})} />
                                    ))}
                                </div>
                            </div>
                            
                            <div className="p-10 flex flex-col overflow-y-auto">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-[10px] font-black bg-blue-50 text-cdr-blue px-3 py-1 rounded-full uppercase tracking-widest">{selectedItem.category}</span>
                                        <h2 className="text-3xl font-black text-slate-900 mt-2">{selectedItem.title}</h2>
                                    </div>
                                    <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={32} /></button>
                                </div>

                                <div className="text-4xl font-black text-cdr-green mb-8">{selectedItem.price}</div>
                                
                                <div className="space-y-6 flex-1">
                                    <p className="text-slate-600 leading-relaxed font-medium">{selectedItem.description}</p>
                                    <div className="flex gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl flex-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lieu</p><p className="font-bold">{selectedItem.location}</p></div>
                                        <div className="p-4 bg-slate-50 rounded-2xl flex-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">État</p><p className="font-bold">{selectedItem.condition}</p></div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-cdr-blue rounded-xl flex items-center justify-center text-white font-black">{selectedItem.sellerName.charAt(0)}</div>
                                            <div><p className="font-black text-slate-900">{selectedItem.sellerName}</p><p className="text-xs text-slate-400">Vendeur Bomoko</p></div>
                                        </div>
                                        {user?.id === selectedItem.sellerId && (
                                            <button onClick={(e) => toggleSoldStatus(selectedItem.id, e)} className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase transition ${selectedItem.isSold ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {selectedItem.isSold ? 'Remettre en vente' : 'Marquer comme vendu'}
                                            </button>
                                        )}
                                    </div>
                                    {!selectedItem.isSold ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <button onClick={() => { startConversation(selectedItem.sellerId, selectedItem.sellerName); setSelectedItem(null); }} className="py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition flex items-center justify-center gap-2 shadow-xl"><MessageSquare size={18} /> Chat</button>
                                            <button className="py-4 border-2 border-slate-200 text-slate-700 font-black rounded-2xl hover:bg-white transition flex items-center justify-center gap-2"><Phone size={18} /> Contact</button>
                                        </div>
                                    ) : (
                                        <div className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-center text-xs uppercase tracking-widest">Cet article n'est plus disponible</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Koop;
