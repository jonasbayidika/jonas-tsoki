
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 border-t-4 border-cdr-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center mb-6 bg-white p-2 rounded-lg inline-block overflow-hidden">
                 <img src="bomoko logo.png" alt="BOMOKO" className="h-10 w-auto object-contain" />
             </div>
             <p className="text-slate-400 text-sm mb-6 leading-relaxed">
               La plateforme de référence pour l'insertion socio-professionnelle de la jeunesse congolaise. Ensemble pour un avenir meilleur.
             </p>
             <div className="flex space-x-4">
               <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-cdr-blue hover:text-white transition-all"><Facebook size={18} /></a>
               <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-400 hover:text-white transition-all"><Twitter size={18} /></a>
               <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18} /></a>
               <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white transition-all"><Linkedin size={18} /></a>
             </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start lg:items-center text-center md:text-left">
            <h4 className="text-lg font-bold mb-8 text-white flex items-center justify-center md:justify-start gap-3 w-full">
                <span className="hidden md:block w-2 h-6 bg-cdr-yellow rounded-full"></span> 
                Navigation
                <span className="w-2 h-6 bg-cdr-yellow rounded-full md:hidden"></span>
            </h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><Link to="/" className="hover:text-cdr-yellow transition flex items-center justify-center md:justify-start gap-2 hover:translate-x-1 duration-300">Accueil</Link></li>
              <li><Link to="/jobs" className="hover:text-cdr-yellow transition flex items-center justify-center md:justify-start gap-2 hover:translate-x-1 duration-300">Offres d'emploi</Link></li>
              <li><Link to="/services" className="hover:text-cdr-yellow transition flex items-center justify-center md:justify-start gap-2 hover:translate-x-1 duration-300">Formations</Link></li>
              <li><Link to="/koop" className="hover:text-cdr-yellow transition flex items-center justify-center md:justify-start gap-2 hover:translate-x-1 duration-300">KOOP Market</Link></li>
              <li><Link to="/partners" className="hover:text-cdr-yellow transition flex items-center justify-center md:justify-start gap-2 hover:translate-x-1 duration-300">Partenaires</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-cdr-red rounded-full"></span> Légal
            </h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Mentions légales</a></li>
              <li><a href="#" className="hover:text-white transition">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-white transition">CGU</a></li>
              <li><a href="#" className="hover:text-white transition">Cookies</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-cdr-blue rounded-full"></span> Contact
            </h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-cdr-red group-hover:text-white transition-colors">
                    <MapPin size={16} />
                </div>
                <span className="group-hover:text-white transition-colors">Av. de la Libération, Kinshasa/Gombe, RDC</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-cdr-red group-hover:text-white transition-colors">
                    <Phone size={16} />
                </div>
                <span className="group-hover:text-white transition-colors font-mono">+243 81 000 0000</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-cdr-red group-hover:text-white transition-colors">
                    <Mail size={16} />
                </div>
                <span className="group-hover:text-white transition-colors">contact@bomoko.cd</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Bomoko Jeunesse Congo. Tous droits réservés.</p>
          <p className="flex items-center gap-1">Fait avec <Heart size={14} className="text-cdr-red fill-current animate-pulse" /> à Kinshasa</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
