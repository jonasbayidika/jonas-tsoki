
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, GraduationCap, MessageSquare, LayoutDashboard, Search, Briefcase, User } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { UserRole } from '../types';

const MobileNav: React.FC = () => {
  const { totalUnreadCount } = useChat();
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  // Déterminer le label du bouton de profil/dashboard
  const getProLabel = () => {
    if (!user) return t('nav_login');
    if (user.role === UserRole.PARTNER) return "Bureau";
    if (user.role === UserRole.FORMATEUR) return "Cours";
    return "Moi";
  };

  const getProIcon = () => {
    if (!user) return <User size={22} className="stroke-[2.5px]" />;
    if (user.role === UserRole.PARTNER) return <Briefcase size={22} className="stroke-[2.5px]" />;
    return <LayoutDashboard size={22} className="stroke-[2.5px]" />;
  };

  const navItems = [
    { to: "/", icon: <Home size={22} className="stroke-[2.5px]" />, label: t('nav_home') },
    { to: "/services", icon: <Search size={22} className="stroke-[2.5px]" />, label: "Services" },
    { to: "/messages", icon: <MessageSquare size={22} className="stroke-[2.5px]" />, label: "Chat", badge: totalUnreadCount },
    { to: user ? "/dashboard" : "/login", icon: getProIcon(), label: getProLabel() }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-2xl border-t border-slate-200/50 px-4 py-3 pb-safe shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center max-w-lg mx-auto relative">
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.to || (item.to === "/dashboard" && location.pathname.startsWith("/profile"));
          
          return (
            <NavLink 
              key={idx}
              to={item.to} 
              className={`relative flex flex-col items-center gap-1.5 px-3 py-1 transition-all duration-300 ${
                isActive ? 'text-cdr-blue -translate-y-1' : 'text-slate-400'
              }`}
            >
              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cdr-blue rounded-full shadow-[0_0_8px_rgba(0,119,255,0.8)]"></span>
              )}

              {/* Icon Container */}
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-cdr-red text-white text-[9px] font-black flex items-center justify-center rounded-full ring-2 ring-white shadow-md animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[9px] font-black uppercase tracking-[0.1em] transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
