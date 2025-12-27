
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Youtube, Play, ArrowLeft, Loader2, Calendar, 
    ExternalLink, X, MessageSquare, Tv, Sparkles
} from 'lucide-react';
import { YouTubeVideo } from '../types';

const Media: React.FC = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
    const [error, setError] = useState<string | null>(null);

    // CONFIGURATION YOUTUBE (À REMPLACER PAR VOS VRAIES CLÉS)
    const API_KEY = "VOTRE_API_KEY_GOOGLE"; // Remplacez par votre clé API Google Cloud Console
    const CHANNEL_ID = "UC_VOTRE_CHANNEL_ID"; // Remplacez par l'ID de votre chaîne YouTube

    const fetchYouTubeVideos = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=12&type=video`
            );
            
            if (!response.ok) throw new Error("Erreur lors de la récupération des vidéos.");
            
            const data = await response.json();
            const formattedVideos: YouTubeVideo[] = data.items.map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high.url,
                publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString('fr-FR'),
                description: item.snippet.description
            }));
            
            setVideos(formattedVideos);
        } catch (err: any) {
            console.error(err);
            setError("Impossible de charger les vidéos. Vérifiez la configuration de l'API.");
            // Mock data pour la démo si l'API échoue
            setVideos([
                { id: '5Ps0Y7YwR_0', title: 'Présentation de Bomoko Jeunesse Congo', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', publishedAt: '12/05/2024', description: 'Découvrez notre vision pour la jeunesse congolaise.' },
                { id: 'dQw4w9WgXcQ', title: 'Tutoriel : Créer son CV sur Bomoko', thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800', publishedAt: '10/05/2024', description: 'Apprenez à valoriser vos compétences.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchYouTubeVideos();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cdr-red transition mb-8 font-black uppercase text-[10px] tracking-widest">
                    <ArrowLeft size={16} /> Retour
                </button>

                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-red-50 text-cdr-red px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                       <Tv size={14} /> Bomoko TV
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Média & Actualités Vidéo</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">Retrouvez tous nos reportages, tutoriels et annonces officielles en vidéo.</p>
                </div>

                {isLoading ? (
                    <div className="py-20 text-center">
                        <Loader2 className="animate-spin text-cdr-red mx-auto mb-4" size={48} />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Chargement du flux YouTube...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((video) => (
                            <div 
                                key={video.id} 
                                onClick={() => setSelectedVideo(video)}
                                className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                            >
                                <div className="h-56 relative overflow-hidden">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-cdr-red/20 transition-colors flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-all text-cdr-red">
                                            <Play size={28} className="fill-current ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                        HD Video
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">
                                        <Calendar size={12} className="text-cdr-red" /> {video.publishedAt}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-cdr-red transition-colors">{video.title}</h3>
                                    <p className="text-sm text-slate-500 font-medium line-clamp-2 italic mb-6 leading-relaxed">"{video.description || "Aucune description disponible pour cette vidéo."}"</p>
                                    <button className="flex items-center gap-2 text-cdr-red font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                                        Regarder maintenant <ExternalLink size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="bg-orange-50 border border-orange-200 p-8 rounded-[2.5rem] text-center max-w-2xl mx-auto mt-10 animate-fadeIn">
                        <Youtube size={48} className="text-cdr-red mx-auto mb-4" />
                        <p className="text-orange-800 font-black mb-2 uppercase tracking-tighter">Information de Connexion</p>
                        <p className="text-orange-600 text-sm">{error}</p>
                        <p className="text-slate-400 text-[10px] mt-4 font-bold uppercase">Les vidéos ci-dessus sont des exemples.</p>
                    </div>
                )}

                <div className="mt-20 p-12 bg-slate-900 rounded-[4rem] text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Youtube size={120} className="text-white" /></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white mb-4">Abonnez-vous à notre chaîne</h2>
                        <p className="text-slate-400 font-medium mb-10 max-w-md mx-auto">Ne manquez aucun de nos live-stream et tutoriels exclusifs pour booster votre carrière.</p>
                        <a 
                            href={`https://www.youtube.com/channel/${CHANNEL_ID}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-cdr-red text-white font-black rounded-2xl hover:bg-red-700 transition shadow-2xl shadow-red-500/20 uppercase text-xs tracking-widest"
                        >
                            S'abonner sur YouTube <Youtube size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* MODAL PLAYER */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl animate-fadeIn" onClick={() => setSelectedVideo(null)}>
                    <div className="w-full max-w-5xl aspect-video bg-black rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/10 animate-slideUp" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-cdr-red text-white rounded-full transition backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>
                        <iframe 
                            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                            className="w-full h-full" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            title={selectedVideo.title}
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Media;
