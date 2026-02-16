
import React, { useState, useEffect } from 'react';
import { FOUNDATIONS_CHAPTERS } from '../constants';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { Book, ChevronRight, Mail, Linkedin, Terminal, Sparkles } from 'lucide-react';

interface FoundationsPageProps {
  language: Language;
}

export const FoundationsPage: React.FC<FoundationsPageProps> = ({ language }) => {
  const [activeChapter, setActiveChapter] = useState(FOUNDATIONS_CHAPTERS[0]?.id || '');
  const t = TRANSLATIONS[language]?.foundations || TRANSLATIONS['EN'].foundations;
  const tAbout = TRANSLATIONS[language]?.about || TRANSLATIONS['EN'].about;

  useEffect(() => {
    if (!activeChapter) return;
    const element = document.getElementById(`chapter-${activeChapter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeChapter]);

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <Book className="w-4 h-4 text-primary-600 mr-2" />
            <span className="text-xs font-bold text-primary-800 uppercase tracking-wide">{t?.knowledgeBase}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6">{t?.title}</h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">{t?.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-6">
            <div>
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">{t?.toc}</h3>
               <div className="space-y-2">
                  {FOUNDATIONS_CHAPTERS.map((chapter) => (
                  <button
                     key={chapter.id}
                     onClick={() => setActiveChapter(chapter.id)}
                     className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-between group ${
                        activeChapter === chapter.id
                        ? 'bg-slate-900 text-white shadow-xl'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
                     }`}
                  >
                     <span className="truncate pr-2">{chapter?.title?.[language] || 'Tutorial'}</span>
                     {activeChapter === chapter.id && <ChevronRight className="h-4 w-4 text-white" />}
                  </button>
                  ))}
               </div>
            </div>

            {/* FOUNDER WIDGET */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
               <div className="h-32 bg-slate-950 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0ea5e9_0%,transparent_70%)] opacity-20"></div>
                  <div className="h-16 w-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10 shadow-inner">
                     <span className="text-2xl font-serif font-bold text-white">EG</span>
                  </div>
               </div>
               <div className="p-6">
                  <div className="pb-4 border-b border-slate-800 mb-4">
                     <p className="text-[9px] font-bold text-primary-500 uppercase tracking-[0.2em] mb-1">{tAbout?.directorTitle}</p>
                     <p className="text-white font-serif font-bold text-lg">{tAbout?.directorName}</p>
                     <p className="text-slate-500 text-[10px] uppercase font-mono tracking-tight">{tAbout?.directorRole}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                     <a href="mailto:EricGaudin0@Proton.me" className="w-full py-3 bg-white text-slate-950 rounded-xl text-[10px] font-bold flex items-center justify-center hover:bg-slate-200 transition-colors shadow-lg">
                        <Mail className="h-3.5 w-3.5 mr-2" /> {tAbout?.directorEmailLabel}
                     </a>
                     <a href="https://www.linkedin.com/in/%C3%A9ric-gaudin-4735a2373" target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-[#0077b5] text-white rounded-xl text-[10px] font-bold flex items-center justify-center hover:bg-[#006097] transition-colors shadow-lg">
                        <Linkedin className="h-3.5 w-3.5 mr-2" /> {tAbout?.directorLinkedinLabel}
                     </a>
                  </div>
               </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-12">
            {FOUNDATIONS_CHAPTERS.map((chapter) => (
              <div 
                key={chapter.id} 
                id={`chapter-${chapter.id}`}
                className={`bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-700 ${
                  activeChapter === chapter.id ? 'opacity-100 ring-2 ring-primary-500/20 shadow-2xl translate-y-0' : 'opacity-40 grayscale blur-[1px] translate-y-4'
                }`}
              >
                <div className="p-8 md:p-14">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-950 mb-10 pb-6 border-b border-slate-100">
                    {chapter?.title?.[language] || 'Documentation'}
                  </h2>
                  
                  <div className="space-y-12">
                    {chapter?.content?.map((block, idx) => (
                      <div key={idx} className="relative">
                        {block?.subtitle && (
                          <div className="flex items-center mb-6">
                             <div className="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center mr-4 text-primary-600 border border-primary-100">
                                <Terminal className="h-4 w-4" />
                             </div>
                             <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                {block?.subtitle?.[language]}
                             </h3>
                          </div>
                        )}
                        <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line ml-12">
                          {block?.text?.[language]}
                        </p>

                        {block?.regionalNote && (
                          <div className="mt-8 ml-12 bg-primary-50/30 border border-primary-100 rounded-2xl p-6 relative overflow-hidden">
                            <div className="relative z-10 flex items-start">
                              <Sparkles className="h-5 w-5 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-primary-900/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{t?.regionalTip || 'TIP'}</p>
                                <p className="text-primary-900 text-sm leading-relaxed font-medium">
                                  {block?.regionalNote?.[language]}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
