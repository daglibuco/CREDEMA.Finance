
import React, { useState } from 'react';
import { ArrowRight, Lock, TrendingUp, Activity, CheckCircle2, Shield, Globe, Calculator, ArrowUpRight, Zap, Briefcase, Mail, Linkedin, Quote, User } from 'lucide-react';
import { Language, View } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface LandingPageProps {
  onNavigate: (view: View) => void;
  language: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, language }) => {
  const t = TRANSLATIONS[language]?.landing || TRANSLATIONS['EN'].landing || {};
  const tAbout = TRANSLATIONS[language]?.about || TRANSLATIONS['EN'].about || {};
  const tSim = t?.simulator || TRANSLATIONS['EN'].landing?.simulator || {};
  const tDiag = t?.diagram || TRANSLATIONS['EN'].landing?.diagram || {};
  const tStake = t?.stakeholders || TRANSLATIONS['EN'].landing?.stakeholders || {};
  const heroTitle = t?.heroTitle || TRANSLATIONS['EN'].landing?.heroTitle || ['', '', '', ''];
  
  // Simulator State
  const [seedCapital, setSeedCapital] = useState<number>(2000000);
  const [allocationPct, setAllocationPct] = useState<number>(30);
  const [multiplier, setMultiplier] = useState<number>(5);

  const securedDeposit = seedCapital * (allocationPct / 100);
  const productBudget = seedCapital - securedDeposit;
  const totalLeverage = securedDeposit * multiplier;

  return (
    <div className="pt-20 bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary-50 rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-6">
                <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">{t.tagline}</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6">
                {heroTitle[0]} <br/>
                <span className="text-primary-600">{heroTitle[1]}</span> {heroTitle[2]} <br/>
                <span className="text-slate-400">{heroTitle[3]}</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                {t.heroDesc}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button onClick={() => onNavigate(View.DASHBOARD)} className="flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-shadow shadow-xl shadow-slate-900/20 group">
                  {t.ctaPortal}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => onNavigate(View.DOCS)} className="flex items-center justify-center px-8 py-4 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                  {t.ctaDocs}
                </button>
              </div>

              <div className="space-y-8 pr-4">
                 {tStake.founder && (
                   <div className="group">
                      <div className="flex items-center mb-2">
                         <div className="p-2 bg-purple-50 rounded-lg mr-3 group-hover:bg-purple-100 transition-colors">
                            <Zap className="h-5 w-5 text-purple-600" />
                         </div>
                         <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{tStake.founder.title}</h3>
                            <p className="text-lg font-bold text-slate-900 font-serif">{tStake.founder.subtitle}</p>
                         </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-3 pl-12 border-l-2 border-purple-100">
                         {tStake.founder.desc}
                      </p>
                   </div>
                 )}

                 {tStake.seed && (
                   <div className="group">
                      <div className="flex items-center mb-2">
                         <div className="p-2 bg-blue-50 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                         </div>
                         <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{tStake.seed.title}</h3>
                            <p className="text-lg font-bold text-slate-900 font-serif">{tStake.seed.subtitle}</p>
                         </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-3 pl-12 border-l-2 border-blue-100">
                         {tStake.seed.desc}
                      </p>
                   </div>
                 )}
              </div>
            </div>

            <div className="relative space-y-12 lg:sticky lg:top-24">
               <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 relative z-10">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">The Capital Flow</h3>
                  <div className="relative aspect-[4/3] w-full">
                     <svg viewBox="0 0 400 300" className="w-full h-full">
                        <defs>
                          <marker id="arrow-lg" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                            <path d="M2,2 L10,6 L2,10 L2,2" fill="#94a3b8" />
                          </marker>
                          <marker id="arrow-blue" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                            <path d="M2,2 L10,6 L2,10 L2,2" fill="#0ea5e9" />
                          </marker>
                        </defs>
                        <rect x="120" y="10" width="160" height="40" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                        <text x="200" y="35" textAnchor="middle" className="text-xs font-bold fill-slate-800">{tDiag.seedInput}</text>
                        <path d="M160 50 L100 110" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow-lg)" strokeDasharray="4 4"/>
                        <path d="M240 50 L300 110" stroke="#0ea5e9" strokeWidth="2" markerEnd="url(#arrow-blue)" />
                        <text x="110" y="80" textAnchor="middle" className="text-[10px] font-medium fill-slate-500 rotate-[-45]">{tDiag.flow1}</text>
                        <text x="290" y="80" textAnchor="middle" className="text-[10px] font-bold fill-primary-600 rotate-[45]">{tDiag.flow2}</text>
                        <rect x="20" y="120" width="140" height="60" rx="8" fill="#f1f5f9" stroke="#94a3b8" />
                        <text x="90" y="145" textAnchor="middle" className="text-xs font-bold fill-slate-700">{tDiag.product}</text>
                        <rect x="240" y="120" width="140" height="60" rx="8" fill="#f0f9ff" stroke="#0ea5e9" strokeWidth="2"/>
                        <text x="310" y="145" textAnchor="middle" className="text-xs font-bold fill-primary-900">{tDiag.deposit}</text>
                        <path d="M310 180 L310 230" stroke="#0ea5e9" strokeWidth="3" markerEnd="url(#arrow-blue)" />
                        <rect x="220" y="240" width="180" height="50" rx="8" fill="#0f172a" stroke="#1e293b" />
                        <text x="310" y="260" textAnchor="middle" className="text-xs font-bold fill-white">{tDiag.leverage}</text>
                     </svg>
                  </div>
               </div>

               <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50">
                  <div className="flex items-center space-x-3 mb-8 border-b border-slate-200 pb-4">
                    <Calculator className="h-6 w-6 text-primary-600" />
                    <h4 className="text-base font-bold uppercase text-slate-800 tracking-wide">{tSim.title}</h4>
                  </div>
                  <div className="space-y-8 mb-10">
                     <div>
                        <div className="flex justify-between mb-3">
                           <label className="text-sm font-bold text-slate-600">{tSim.seedLabel}</label>
                           <span className="text-lg font-mono font-bold text-slate-900">${(seedCapital / 1000000).toFixed(1)}M</span>
                        </div>
                        <input 
                            type="range" min="500000" max="5000000" step="100000" 
                            value={seedCapital}
                            onChange={(e) => setSeedCapital(Number(e.target.value))}
                            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 uppercase block mb-1 font-bold">{tSim.outputProduct}</span>
                        <span className="font-mono font-bold text-slate-800 text-xl">${(productBudget / 1000).toFixed(0)}k</span>
                     </div>
                     <div onClick={() => onNavigate(View.REGISTER_STARTUP)} className="col-span-2 bg-slate-900 p-6 rounded-xl flex justify-between items-center group cursor-pointer transition-transform hover:scale-[1.02]">
                        <div>
                           <span className="text-[10px] text-slate-400 uppercase block mb-2 font-bold tracking-wider">{tSim.outputLeverage}</span>
                           <span className="font-mono font-bold text-white text-3xl">${(totalLeverage / 1000000).toFixed(2)}M</span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                            <ArrowUpRight className="text-green-400 h-5 w-5 group-hover:text-white" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER SPOTLIGHT - INSTITUTIONAL BRANDING LAYOUT */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative border border-slate-800">
              <div className="flex flex-col md:flex-row items-stretch">
                 
                 <div className="w-full md:w-5/12 bg-slate-950 flex flex-col items-center justify-center p-12 text-center relative border-r border-slate-800 min-h-[400px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0ea5e9_0%,transparent_70%)] opacity-10"></div>
                    <div className="relative z-10">
                       <div className="h-32 w-32 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 mx-auto shadow-inner">
                          <span className="text-5xl font-serif font-bold text-white">EG</span>
                       </div>
                       <div className="h-px w-16 bg-emerald-500 mb-8 mx-auto"></div>
                       <p className="text-white font-serif font-bold text-2xl mb-1 tracking-tight">{tAbout.directorName}</p>
                       <p className="text-emerald-500 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">{tAbout.directorRole}</p>
                    </div>
                 </div>
                 
                 <div className="w-full md:w-7/12 p-10 md:p-16 lg:p-20 relative bg-gradient-to-br from-slate-900 to-slate-950">
                    <div className="absolute top-10 right-10 opacity-5 pointer-events-none">
                       <Quote className="h-32 w-32 text-white" />
                    </div>
                    
                    <div className="relative z-10">
                       {/* HIGH CONTRAST BADGE FIXED */}
                       <div className="mb-8 inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-600 border border-emerald-500 shadow-lg">
                          <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{tAbout.directorTitle}</span>
                       </div>
                       
                       <h2 className="text-2xl lg:text-4xl font-serif font-bold text-white mb-10 leading-tight tracking-tight">
                          Modernizing high-growth finance through <span className="text-emerald-500 italic">cryptographic conviction.</span>
                       </h2>
                       
                       <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-light border-l-4 border-emerald-600 pl-8 mb-12">
                          {tAbout.directorIntro}
                       </p>
                       
                       <div className="flex gap-4">
                          <a href="mailto:EricGaudin0@Proton.me" className="flex items-center px-6 py-3 bg-white text-slate-950 rounded-xl hover:bg-slate-200 transition-all font-bold text-xs group shadow-xl">
                             <Mail className="h-4 w-4 mr-2" />
                             {tAbout.directorEmailLabel}
                          </a>
                          <a href="https://www.linkedin.com/in/%C3%A9ric-gaudin-4735a2373" target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-3 bg-[#0077b5] text-white rounded-xl hover:bg-[#006097] transition-all font-bold text-xs group shadow-xl">
                             <Linkedin className="h-4 w-4 mr-2" />
                             {tAbout.directorLinkedinLabel}
                          </a>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-slate-50 py-24 border-t border-slate-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.features?.title}</h2>
               <p className="text-slate-600">{t.features?.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                     <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{t.features?.escrowTitle}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                     {t.features?.escrowDesc}
                  </p>
               </div>

               <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6">
                     <Activity className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{t.features?.telemetryTitle}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                     {t.features?.telemetryDesc}
                  </p>
               </div>

               <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6">
                     <Globe className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{t.features?.complianceTitle}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                     {t.features?.complianceDesc}
                  </p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
