
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Handshake, Globe, Award, ArrowRight, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react';

const PARTNERS = [
  {
    id: 1,
    name: "Vodacom RDC",
    sector: "Télécommunications",
    description: "Leader de la téléphonie mobile en RDC, engagé dans la digitalisation de l'éducation et l'accès à internet pour tous.",
    color: "bg-red-600",
    textColor: "text-red-600"
  },
  {
    id: 2,
    name: "EquityBCDC",
    sector: "Banque & Finance",
    description: "Institution bancaire majeure soutenant l'entrepreneuriat des jeunes et l'inclusion financière à travers le pays.",
    color: "bg-amber-800",
    textColor: "text-amber-800"
  },
  {
    id: 3,
    name: "Orange RDC",
    sector: "Technologie",
    description: "Partenaire clé pour la formation numérique via l'Orange Digital Center, offrant des opportunités aux développeurs.",
    color: "bg-orange-500",
    textColor: "text-orange-500"
  },
  {
    id: 4,
    name: "Rawbank",
    sector: "Banque",
    description: "Acteur économique de premier plan, Rawbank accompagne les PME et les startups innovantes congolaises.",
    color: "bg-blue-900",
    textColor: "text-blue-900"
  },
  {
    id: 5,
    name: "Bracongo",
    sector: "Industrie",
    description: "Engagé dans la responsabilité sociétale, Bracongo offre de nombreux stages et opportunités industrielles.",
    color: "bg-yellow-500",
    textColor: "text-yellow-600"
  },
  {
    id: 6,
    name: "ONU Femmes RDC",
    sector: "Institution Internationale",
    description: "Collaboration pour promouvoir l'égalité des genres et l'autonomisation économique des jeunes femmes.",
    color: "bg-blue-400",
    textColor: "text-blue-400"
  }
];

const Partners: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cdr-blue rounded-full opacity-10 blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cdr-yellow rounded-full opacity-10 blur-3xl -ml-20 -mb-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button onClick={() => navigate(-1)} className="absolute top-0 left-4 md:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition">
            <ArrowLeft size={20} /> Retour
          </button>
          
          <div className="text-center mt-8">
            <span className="inline-block px-4 py-1 rounded-full bg-slate-800 text-cdr-yellow text-sm font-semibold mb-6 border border-slate-700">
                Ensemble, on va plus loin
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                Nos <span className="text-cdr-blue">Partenaires</span> Stratégiques
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
                Ils croient en la jeunesse congolaise et s'engagent à nos côtés pour créer des opportunités d'emploi, de formation et d'innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PARTNERS.map((partner) => (
            <div key={partner.id} className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 ${partner.color} rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {partner.name.substring(0, 1)}
                </div>
                <div className={`text-xs font-bold uppercase tracking-wider py-1 px-2 rounded-md bg-slate-50 ${partner.textColor}`}>
                  {partner.sector}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{partner.name}</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                {partner.description}
              </p>
              <div className="border-t border-slate-50 pt-4 flex items-center text-sm font-semibold text-slate-400 group-hover:text-cdr-blue transition-colors cursor-pointer">
                En savoir plus <ExternalLink size={16} className="ml-2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Pourquoi rejoindre le réseau <span className="text-cdr-blue">Bomoko</span> ?</h2>
              <p className="text-slate-600 mb-8 text-lg">
                Devenir partenaire de Bomoko Jeunesse Congo, c'est investir directement dans le capital humain de la RDC tout en valorisant votre image de marque.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-cdr-blue rounded-full flex items-center justify-center shrink-0">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Impact Social Direct</h4>
                    <p className="text-slate-600 text-sm">Contribuez à la réduction du chômage et à l'autonomisation des jeunes.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-yellow-50 text-cdr-yellow rounded-full flex items-center justify-center shrink-0">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Accès aux Talents</h4>
                    <p className="text-slate-600 text-sm">Recrutez parmi un vivier de profils qualifiés, formés et motivés.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-50 text-cdr-green rounded-full flex items-center justify-center shrink-0">
                    <Handshake size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Visibilité RSE</h4>
                    <p className="text-slate-600 text-sm">Associez votre marque à une initiative positive et innovante reconnue.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
               {/* Abstract visual decoration */}
               <div className="absolute -top-4 -right-4 w-24 h-24 bg-cdr-red opacity-10 rounded-full blur-xl"></div>
               
               <h3 className="text-2xl font-bold text-slate-900 mb-4">Devenez Partenaire</h3>
               <p className="text-slate-600 mb-6">
                 Vous souhaitez collaborer avec nous sur un projet spécifique ou soutenir notre mission globalement ?
               </p>
               
               <ul className="space-y-3 mb-8">
                 <li className="flex items-center gap-2 text-slate-700">
                   <CheckCircle size={18} className="text-cdr-green" /> Sponsoriser une formation
                 </li>
                 <li className="flex items-center gap-2 text-slate-700">
                   <CheckCircle size={18} className="text-cdr-green" /> Publier des offres exclusives
                 </li>
                 <li className="flex items-center gap-2 text-slate-700">
                   <CheckCircle size={18} className="text-cdr-green" /> Mécénat de compétences
                 </li>
               </ul>

               <Link to="/contact" className="block w-full py-4 bg-cdr-blue text-white font-bold text-center rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-blue-200 transform hover:-translate-y-1">
                 Nous Contacter <ArrowRight size={18} className="inline ml-2" />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-cdr-red py-16 text-center text-white">
        <div className="max-w-4xl mx-auto px-4">
          <Building2 size={48} className="mx-auto mb-6 text-white opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Votre entreprise a un rôle à jouer</h2>
          <p className="text-lg text-white/90 mb-8">
            Rejoignez le mouvement Bomoko et construisons ensemble l'avenir professionnel de la RDC.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/contact" className="px-8 py-3 bg-white text-cdr-red font-bold rounded-lg hover:bg-slate-100 transition">
               Devenir Partenaire
             </Link>
             <Link to="/news" className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition">
               Voir nos actions
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
