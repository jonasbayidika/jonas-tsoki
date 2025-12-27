
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'fr' | 'en' | 'ln' | 'sw';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Navbar
  nav_home: { fr: 'Accueil', en: 'Home', ln: 'Boyeyi', sw: 'Nyumbani' },
  nav_services: { fr: 'Services', en: 'Services', ln: 'Misala', sw: 'Huduma' },
  nav_communities: { fr: 'Communautés', en: 'Communities', ln: 'Masanga', sw: 'Jumuiya' },
  nav_koop: { fr: 'KOOP Market', en: 'KOOP Market', ln: 'Zando', sw: 'Soko' },
  nav_about: { fr: 'À propos', en: 'About', ln: 'Biso', sw: 'Kuhusu' },
  nav_login: { fr: 'Connexion', en: 'Login', ln: 'Kokota', sw: 'Ingia' },
  nav_signup: { fr: 'S\'inscrire', en: 'Sign Up', ln: 'Komisa', sw: 'Jisajili' },
  
  // Home Hero
  hero_tag: { fr: 'Plateforme #1 de la Jeunesse en RDC', en: '#1 Platform for Youth in DRC', ln: 'Ebwanzo ya yambo mpona bilenge', sw: 'Jukwaa la kwanza la vijana nchini DRC' },
  hero_title_1: { fr: "L'avenir se construit", en: "Building the future", ln: "Lobi ekotongama", sw: "Kujenga baadaye" },
  hero_title_2: { fr: 'ENSEMBLE.', en: 'TOGETHER.', ln: 'ELONGO.', sw: 'PAMOJA.' },
  hero_desc: { fr: 'BOMOKO connecte la jeunesse congolaise aux opportunités d\'emploi, de formation et d\'entrepreneuriat.', en: 'BOMOKO connects Congolese youth to employment, training and entrepreneurship opportunities.', ln: 'BOMOKO esangisi bilenge mpona mosala, mateya mpe misala ya nkita.', sw: 'BOMOKO inaunganisha vijana wa Kongo na fursa za ajira, mafunzo na ujasiriamali.' },
  hero_cta_start: { fr: 'Commencer maintenant', en: 'Get Started', ln: 'Banda sikoyo', sw: 'Anza sasa' },
  hero_cta_vision: { fr: 'Notre vision', en: 'Our vision', ln: 'Makanisi na biso', sw: 'Maono yetu' },
  
  // Sections
  sec_ecosystem: { fr: 'Écosystème', en: 'Ecosystem', ln: 'Ezingelo', sw: 'Mazingira' },
  sec_needs: { fr: 'Tout ce dont vous avez besoin.', en: 'Everything you need.', ln: 'Nioso oza na posa.', sw: 'Kila kitu unachohitaji.' },
  
  // Settings
  settings_title: { fr: 'Paramètres', en: 'Settings', ln: 'Bongisi', sw: 'Mipangilio' },
  settings_lang: { fr: 'Langue de l\'application', en: 'App Language', ln: 'Lokota ya esaleli', sw: 'Lugha ya programu' },
  settings_save: { fr: 'Enregistrer les modifications', en: 'Save Changes', ln: 'Bombisa mbonguana', sw: 'Hifadhi mabadiliko' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('bomoko_lang') as Language) || 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bomoko_lang', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key]['fr'];
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};
