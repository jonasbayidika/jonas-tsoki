
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, User, LogOut, Briefcase, Settings, Mail, 
  ChevronDown, Globe, LayoutDashboard, ShoppingBag, 
  GraduationCap, Bell, Users, Info, MessageSquareHeart,
  Star, PhoneCall, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useTranslation, Language } from '../context/LanguageContext';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalUnreadCount } = useChat();
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProfileMenuOpen(false);
    setIsLangMenuOpen(false);
  }, [location]);

  const navLinks = useMemo(() => {
    const links = [
      { name: t('nav_home'), path: '/', icon: <LayoutDashboard size={18} /> },
      { name: t('nav_services'), path: '/services', icon: <GraduationCap size={18} /> },
      { name: t('nav_communities'), path: '/communities', icon: <Users size={18} /> },
      { name: 'KOOP Market', path: '/koop', icon: <ShoppingBag size={18} /> },
      { name: 'À propos', path: '/about', icon: <Info size={18} /> },
    ];

    if (user) {
      links.push({ 
        name: 'Messages', 
        path: '/messages', 
        icon: (
          <div className="relative">
            <MessageSquare size={18} />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-cdr-red text-white text-[8px] font-black flex items-center justify-center rounded-full ring-2 ring-white">
                {totalUnreadCount}
              </span>
            )}
          </div>
        ) 
      });
    }

    links.push({ name: 'Contact', path: '/contact', icon: <PhoneCall size={18} /> });
    return links;
  }, [t, user, totalUnreadCount]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇨🇩' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ln', label: 'Lingala', flag: '🇨🇩' },
    { code: 'sw', label: 'Swahili', flag: '🇹🇿' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-2xl shadow-lg border-b border-slate-200/50 py-1.5' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO AREA */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group relative">
              <div className="bg-white/10 p-1.5 rounded-xl group-hover:bg-white/20 transition-all duration-500">
                {!logoError ? (
                  <img 
                    src="bomoko logo.png" 
                    alt="BOMOKO JEUNESSE CONGO" 
                    onError={() => setLogoError(true)}
                    className="h-10 md:h-12 w-auto object-contain transition-all duration-700 group-hover:scale-110 group-hover:rotate-2 drop-shadow-sm" 
                  />
                ) : (
                  <div className="flex items-center gap-1 font-black text-2xl tracking-tighter">
                     <span className="text-cdr-blue">BO</span><span className="text-cdr-red">MO</span><span className="text-cdr-yellow">KO</span>
                  </div>
                )}
              </div>
              <div className="hidden xl:flex flex-col -space-y-1">
                 <span className="text-slate-900 font-black text-sm tracking-tight leading-none group-hover:text-cdr-blue transition-colors">BOMOKO</span>
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Jeunesse Congo</span>
              </div>
            </Link>
          </div>
          
          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center bg-slate-100/40 rounded-[1.3rem] p-1.5 border border-slate-200/20 backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-500 relative overflow-hidden group ${
                  isActive(link.path) 
                    ? 'bg-white text-cdr-blue shadow-md' 
                    : 'text-slate-500 hover:text-cdr-blue'
                }`}
              >
                <span className={`transition-transform duration-500 group-hover:scale-110 ${isActive(link.path) ? 'scale-110' : ''}`}>
                  {link.icon}
                </span>
                <span className="relative z-10">{link.name}</span>
                
                {/* Subtle Hover Underline Effect */}
                {!isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-cdr-blue transition-all duration-500 -translate-x-1/2 group-hover:w-1/2 rounded-full opacity-50"></span>
                )}
              </Link>
            ))}
          </div>
            
          {/* RIGHT TOOLS */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <button 
                onClick={() => { setIsLangMenuOpen(!isLangMenuOpen); setIsProfileMenuOpen(false); }}
                className="flex items-center gap-2 p-3 text-slate-600 hover:bg-white hover:shadow-sm rounded-2xl transition-all duration-300 font-bold border border-transparent hover:border-slate-100"
              >
                <Globe size={20} className="transition-transform group-hover:rotate-12" />
                <span className="text-[11px] font-black uppercase hidden sm:block tracking-widest">{language}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-lg rounded-[2rem] shadow-2xl border border-slate-100 py-3 animate-slideUp z-50 overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code as Language); setIsLangMenuOpen(false); }}
                      className={`w-full text-left px-5 py-3.5 text-sm flex items-center justify-between hover:bg-blue-50/50 transition-colors ${
                        language === lang.code ? 'text-cdr-blue font-black bg-blue-50/30' : 'text-slate-600 font-bold'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">{lang.flag}</span>
                        {lang.label}
                      </span>
                      {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-cdr-blue"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                    <button 
                      onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsLangMenuOpen(false); }} 
                      className={`flex items-center gap-2 p-1 pr-4 rounded-[1.4rem] border transition-all duration-500 shadow-sm ${
                        isProfileMenuOpen ? 'border-cdr-blue bg-blue-50/30' : 'border-slate-200 bg-white hover:border-cdr-blue hover:shadow-md'
                      }`}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-cdr-blue to-blue-700 rounded-xl flex items-center justify-center text-white text-base font-black border-2 border-white shadow-sm overflow-hidden transform hover:rotate-3 transition-transform">
                          {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-500 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2.5rem] shadow-2xl py-2 border border-slate-100 animate-slideUp z-50 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/50 mb-1 flex items-center gap-3">
                          <div className="w-10 h-10 bg-cdr-blue/10 rounded-xl flex items-center justify-center text-cdr-blue font-black text-sm">
                             {user.firstname.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate leading-none mb-1">{user.firstname} {user.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{user.role}</p>
                          </div>
                        </div>
                        <div className="p-2 space-y-0.5">
                            <Link to="/dashboard" className="flex items-center gap-4 px-5 py-3.5 text-sm text-slate-600 hover:bg-blue-50/50 hover:text-cdr-blue rounded-2xl transition-all font-bold"><LayoutDashboard size={18} className="opacity-70"/> Mon Dashboard</Link>
                            <Link to="/messages" className="flex items-center gap-4 px-5 py-3.5 text-sm text-slate-600 hover:bg-red-50/50 hover:text-cdr-red rounded-2xl transition-all font-bold"><MessageSquare size={18} className="opacity-70"/> Messagerie</Link>
                            <Link to="/profile" className="flex items-center gap-4 px-5 py-3.5 text-sm text-slate-600 hover:bg-blue-50/50 hover:text-cdr-blue rounded-2xl transition-all font-bold"><User size={18} className="opacity-70"/> Mon Profil</Link>
                            <Link to="/settings" className="flex items-center gap-4 px-5 py-3.5 text-sm text-slate-600 hover:bg-blue-50/50 hover:text-cdr-blue rounded-2xl transition-all font-bold"><Settings size={18} className="opacity-70"/> {t('settings_title')}</Link>
                        </div>
                        <div className="border-t border-slate-50 mt-1 p-2">
                            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-3.5 text-red-600 hover:bg-red-50 rounded-2xl transition-all font-black text-sm"><LogOut size={18} /> Déconnexion</button>
                        </div>
                    </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-3 rounded-2xl text-sm font-black text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all">Connexion</Link>
                <Link to="/signup" className="px-7 py-3.5 bg-cdr-blue text-white text-xs font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest">S'inscrire</Link>
              </div>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-3 bg-slate-100/80 rounded-2xl transition-all hover:bg-white active:scale-90 border border-transparent hover:border-slate-200">
              {isOpen ? <X size={26} className="text-cdr-red" /> : <Menu size={26} className="text-slate-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white animate-fadeIn overflow-y-auto">
          <div className="p-6 pt-24 space-y-8">
            <div className="grid grid-cols-1 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)} 
                  className={`flex items-center gap-5 px-8 py-6 rounded-[2rem] text-xl font-black transition-all transform active:scale-95 ${
                    isActive(link.path) 
                      ? 'bg-cdr-blue text-white shadow-2xl shadow-blue-500/30 -translate-y-1' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {React.cloneElement(link.icon as React.ReactElement<any>, { size: 28, className: "stroke-[2.5px]" })}
                  {link.name}
                </Link>
              ))}
            </div>
            
            {!user && (
               <div className="pt-6 grid grid-cols-1 gap-4">
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-center font-black uppercase tracking-widest shadow-xl">Créer un compte</Link>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-6 border-2 border-slate-100 rounded-[2rem] text-center font-black uppercase tracking-widest">Se connecter</Link>
               </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
