
import React from 'react';
import { Language, View } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { Target, Users, ShieldCheck, ArrowRight, Mail, Linkedin, Quote } from 'lucide-react';

interface AboutUsPageProps {
  language: Language;
  onNavigate: (view: View) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ language, onNavigate }) => {
  const t = TRANSLATIONS[language]?.about || TRANSLATIONS['EN'].about;

  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* DIRECTOR MANIFESTO SECTION - TYPOGRAPHIC DESIGN */}
        <div className="mb-24 bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 relative">
           <div className="flex flex-col lg:flex-row items-stretch">
              {/* Institutional Branding Column */}
              <div className="w-full lg:w-4/12 min-h-[300px] lg:min-h-[600px] relative bg-slate-950 flex flex-col items-center justify-center p-12 text-center overflow-hidden border-r border-slate-800">
                 <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_50%)]"></div>
                 </div>
                 
                 <div className="relative z-10">
                    <div className="h-24 w-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 mx-auto shadow-inner">
                       <span className="text-4xl font-serif font-bold text-white tracking-tighter">EG</span>
                    </div>
                    <div className="h-px w-12 bg-emerald-500 mb-6 mx-auto"></div>
                    <p className="text-white font-serif font-bold text-xl mb-1 tracking-tight">{t?.directorName}</p>
                    <p className="text-emerald-500 font-mono text-[9px] uppercase tracking-[0.3em] font-bold">{t?.directorRole}</p>
                 </div>
              </div>
              
              {/* Manifesto Content Column */}
              <div className="w-full lg:w-8/12 p-8 md:p-16 lg:p-20 flex flex-col justify-center relative bg-gradient-to-br from-slate-900 to-slate-950">
                 <div className="absolute top-12 right-12 opacity-5 pointer-events-none hidden md:block">
                    <Quote className="h-48 w-48 text-white" />
                 </div>
                 
                 <div className="relative z-10">
                    {/* HIGH CONTRAST BADGE */}
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-600 border border-emerald-500 mb-8 backdrop-blur-sm shadow-lg">
                       <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{t?.directorTitle}</span>
                    </div>
                    
                    <h2 className="font-serif text-3xl md:text-5xl lg:text-5xl font-bold text-white mb-10 leading-[1.1] tracking-tight">
                      Preserving Equity Through <span className="text-emerald-500 italic">Scientific Finance.</span>
                    </h2>
                    
                    <div className="relative mb-12 pl-8 border-l-2 border-emerald-600/30">
                      <p className="text-slate-200 text-lg md:text-xl leading-relaxed font-light">
                        {t?.directorIntro}
                      </p>
                    </div>

                    <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-8">
                       <div className="flex flex-wrap items-center gap-4">
                          <a 
                            href="mailto:EricGaudin0@Proton.me" 
                            className="bg-white text-slate-950 hover:bg-slate-200 px-6 py-3 rounded-xl font-bold flex items-center transition-all shadow-xl group text-xs"
                          >
                             <Mail className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                             {t?.directorEmailLabel}
                          </a>

                          <a 
                            href="https://www.linkedin.com/in/%C3%A9ric-gaudin-4735a2373" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#0077b5] hover:bg-[#006097] text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all shadow-xl group text-xs"
                          >
                             <Linkedin className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                             {t?.directorLinkedinLabel}
                          </a>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Intro Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {t?.title}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            {t?.subtitle}
          </p>
        </div>

        {/* Market Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
             <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-red-500 mr-4" />
                <h2 className="text-2xl font-bold text-slate-900 font-serif">{t?.problemTitle}</h2>
             </div>
             <p className="text-slate-600 leading-loose text-lg mb-4">
               {t?.problemDesc}
             </p>
          </div>
          <div className="p-4">
             <h2 className="text-3xl font-bold text-slate-900 font-serif mb-6 flex items-center">
                <ShieldCheck className="h-8 w-8 text-emerald-600 mr-4" />
                {t?.solutionTitle}
             </h2>
             <p className="text-slate-600 leading-loose text-xl">
                {t?.solutionDesc}
             </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          
          {/* For Founders */}
          <div className="bg-slate-900 text-white p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden group border border-slate-800">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Users className="h-48 w-48" />
             </div>
             <h3 className="text-3xl font-bold font-serif mb-8 flex items-center">
                {t?.forFounders}
             </h3>
             <ul className="space-y-6 relative z-10 mb-12">
                {t?.founderBenefits?.map((benefit: string, i: number) => (
                   <li key={i} className="flex items-start">
                      <span className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 border border-emerald-500/30">
                         {i + 1}
                      </span>
                      <span className="text-slate-300 text-lg leading-relaxed">{benefit}</span>
                   </li>
                ))}
             </ul>
             <button 
               onClick={() => onNavigate(View.REGISTER_STARTUP)}
               className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center shadow-2xl"
             >
                {t?.applyNow}
                <ArrowRight className="h-5 w-5 ml-2" />
             </button>
          </div>

          {/* For Investors */}
          <div className="bg-white text-slate-900 p-10 md:p-14 rounded-[2.5rem] border border-slate-200 relative overflow-hidden group shadow-sm">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                <ShieldCheck className="h-48 w-48 text-slate-900" />
             </div>
             <h3 className="text-3xl font-bold font-serif mb-8 flex items-center">
                {t?.forInvestors}
             </h3>
             <ul className="space-y-6 relative z-10 mb-12">
                {t?.investorBenefits?.map((benefit: string, i: number) => (
                   <li key={i} className="flex items-start">
                      <span className="h-8 w-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 border border-slate-200">
                         {i + 1}
                      </span>
                      <span className="text-slate-600 text-lg leading-relaxed">{benefit}</span>
                   </li>
                ))}
             </ul>
             <button 
               onClick={() => onNavigate(View.DASHBOARD)}
               className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center shadow-2xl shadow-slate-900/20"
             >
                {t?.browseDeals}
                <ArrowRight className="h-5 w-5 ml-2" />
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};
