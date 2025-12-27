
import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Calendar, Tag, Share2, MessageCircle, Clock } from 'lucide-react';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
      const storedNews = localStorage.getItem('bomoko_news');
      if (storedNews) {
          setNews(JSON.parse(storedNews));
      }
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cdr-red transition mb-6">
            <ArrowLeft size={20} /> Retour
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Actualités & Événements</h1>
        <p className="text-slate-500 text-center mb-10">Restez informé de tout ce qui bouge dans l'écosystème BOMOKO.</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
              <div className="relative overflow-hidden h-48">
                <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold text-white uppercase bg-cdr-red/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
                        {item.category}
                    </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-3 font-medium uppercase tracking-wider">
                  <Calendar size={12} /> {item.date}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-cdr-red transition-colors">{item.title}</h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">{item.excerpt}</p>
                
                <div className="mt-auto border-t border-slate-50 pt-4 flex justify-between items-center">
                    <button 
                        onClick={() => setSelectedArticle(item)}
                        className="text-cdr-red font-bold text-sm hover:underline flex items-center gap-1 group/btn"
                    >
                        Lire la suite <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-300 hover:text-blue-500 transition-colors">
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL ARTICLE DÉTAILLÉ */}
        {selectedArticle && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn"
                onClick={() => setSelectedArticle(null)}
            >
                <div 
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slideUp relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Image inside Modal */}
                    <div className="h-64 md:h-80 relative">
                        <img 
                            src={selectedArticle.image} 
                            alt={selectedArticle.title} 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        
                        <button 
                            onClick={() => setSelectedArticle(null)}
                            className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full transition z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="absolute bottom-6 left-6 md:left-10 right-6 md:right-10 text-white">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-xs font-bold bg-cdr-red text-white px-2 py-1 rounded">
                                    {selectedArticle.category}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-white/80 font-medium">
                                    <Calendar size={14} /> {selectedArticle.date}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-white/80 font-medium">
                                    <Clock size={14} /> 3 min de lecture
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                                {selectedArticle.title}
                            </h2>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-6 md:p-10">
                        <div className="flex flex-col md:flex-row gap-10">
                            {/* Main Content */}
                            <div className="flex-1 space-y-6">
                                <p className="text-xl font-medium text-slate-700 leading-relaxed border-l-4 border-cdr-red pl-6 italic">
                                    {selectedArticle.excerpt}
                                </p>
                                
                                <div className="prose prose-slate max-w-none">
                                    {selectedArticle.content ? (
                                        selectedArticle.content.split('\n\n').map((paragraph, idx) => (
                                            <p key={idx} className="text-slate-600 text-lg leading-relaxed mb-6">
                                                {paragraph}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-slate-600 text-lg leading-relaxed">
                                            Le contenu complet de cet article est en cours de rédaction. Veuillez revenir plus tard pour plus de détails.
                                        </p>
                                    )}
                                </div>

                                {/* Actions bottom */}
                                <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-bold transition">
                                            <Share2 size={18} /> Partager
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-bold transition">
                                            <MessageCircle size={18} /> 12 Commentaires
                                        </button>
                                    </div>
                                    <div className="text-slate-400 text-sm italic">
                                        Publié par la Rédaction Bomoko
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar / More articles */}
                            <div className="md:w-64 space-y-8">
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Tag size={18} className="text-cdr-red" /> Tags
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border text-slate-500">RDC</span>
                                        <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border text-slate-500">Jeunesse</span>
                                        <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border text-slate-500">Avenir</span>
                                        <span className="text-[10px] font-bold bg-white px-2 py-1 rounded border text-slate-500">Tech</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-800 border-b pb-2">À lire aussi</h4>
                                    {news.filter(n => n.id !== selectedArticle.id).slice(0, 2).map(n => (
                                        <div 
                                            key={n.id} 
                                            className="group cursor-pointer"
                                            onClick={() => setSelectedArticle(n)}
                                        >
                                            <div className="h-24 w-full overflow-hidden rounded-lg mb-2">
                                                <img src={n.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                                            </div>
                                            <h5 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-cdr-red">{n.title}</h5>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default News;
