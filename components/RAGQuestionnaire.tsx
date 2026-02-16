import React, { useState } from 'react';
import { Language, StartupRAGContext } from '../types';
import { Brain, Save, Sparkles, CheckCircle2, AlertCircle, ArrowRight, ChevronRight, Target, Shield, Users, Coins, Lightbulb } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';
import { InfoTooltip } from './InfoTooltip';

interface RAGQuestionnaireProps {
  language: Language;
  onComplete: (data: StartupRAGContext) => void;
  initialData?: StartupRAGContext;
}

export const RAGQuestionnaire: React.FC<RAGQuestionnaireProps> = ({ language, onComplete, initialData }) => {
  const [step, setStep] = useState(1);
  const [isTraining, setIsTraining] = useState(false);
  const [formData, setFormData] = useState<StartupRAGContext>(initialData || {
    problem: '',
    solution: '',
    marketStrategy: '',
    competition: '',
    teamBackground: '',
    useOfFunds: ''
  });

  const tooltips = TRANSLATIONS[language].tooltips;
  const t = TRANSLATIONS[language].rag;
  const tCommon = TRANSLATIONS[language].common;

  const handleChange = (field: keyof StartupRAGContext, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    setIsTraining(true);
    // Simulate AI Vector Embedding process
    setTimeout(() => {
      setIsTraining(false);
      onComplete(formData);
    }, 2500);
  };

  if (isTraining) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <Brain className="h-24 w-24 text-slate-900 relative z-10 animate-bounce" />
          <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-spin-slow" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t.ingest}</h2>
        <div className="space-y-2 max-w-md w-full">
           <div className="flex justify-between text-xs text-slate-500 font-mono uppercase">
              <span>{t.tokenizing}</span>
              <span className="text-green-600">Done</span>
           </div>
           <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 w-full animate-[loading_2s_ease-in-out]"></div>
           </div>
           <p className="text-slate-500 mt-4 text-sm">{t.generating}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
           <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">{t.badge}</span>
           </div>
           <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">{t.title}</h1>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto">
             {t.subtitle}
           </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center max-w-2xl mx-auto mb-12 relative">
           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
           {[1, 2, 3].map((s) => (
             <div key={s} className={`flex flex-col items-center ${step >= s ? 'text-slate-900' : 'text-slate-400'}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-colors ${
                  step === s ? 'bg-slate-900 text-white ring-4 ring-slate-100' : 
                  step > s ? 'bg-green-500 text-white' : 'bg-white border-2 border-slate-200'
                }`}>
                   {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-slate-50 px-2">
                  {t.steps[s - 1]}
                </span>
             </div>
           ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
           
           {/* STEP 1: PRODUCT & MARKET */}
           {step === 1 && (
             <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-center mb-2">
                   <Target className="h-6 w-6 text-blue-600 mr-3" />
                   <h2 className="text-2xl font-bold text-slate-900">{t.sections.proposition}</h2>
                </div>
                
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      The Problem (Deep Dive) <InfoTooltip text={tooltips.ragProblem} />
                   </label>
                   <p className="text-xs text-slate-500 mb-2">Describe the specific pain point your customer faces. Quantify the inefficiency if possible.</p>
                   <textarea 
                      value={formData.problem}
                      onChange={(e) => handleChange('problem', e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg p-4 h-32 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-700"
                      placeholder="e.g., Current protein folding simulations take months on supercomputers..."
                   ></textarea>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      The Solution (Technical & Product) <InfoTooltip text={tooltips.ragSolution} />
                   </label>
                   <p className="text-xs text-slate-500 mb-2">How does your technology solve this? Be specific about the mechanism.</p>
                   <textarea 
                      value={formData.solution}
                      onChange={(e) => handleChange('solution', e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg p-4 h-32 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-700"
                      placeholder="e.g., Our 'Alpha-Helix' engine uses a proprietary transformer architecture..."
                   ></textarea>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      Market Strategy (GTM) <InfoTooltip text={tooltips.ragMarket} />
                   </label>
                   <p className="text-xs text-slate-500 mb-2">Who are you selling to first? How do you acquire them?</p>
                   <textarea 
                      value={formData.marketStrategy}
                      onChange={(e) => handleChange('marketStrategy', e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg p-4 h-24 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-700"
                      placeholder="e.g., Direct sales to Tier-2 Pharma companies..."
                   ></textarea>
                </div>
             </div>
           )}

           {/* STEP 2: MOAT & TEAM */}
           {step === 2 && (
             <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-center mb-2">
                   <Shield className="h-6 w-6 text-purple-600 mr-3" />
                   <h2 className="text-2xl font-bold text-slate-900">{t.sections.defensibility}</h2>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      Competitive Moat <InfoTooltip text={tooltips.ragCompetition} />
                   </label>
                   <p className="text-xs text-slate-500 mb-2">Why can't Google or a fast follower copy this in 6 months?</p>
                   <textarea 
                      value={formData.competition}
                      onChange={(e) => handleChange('competition', e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg p-4 h-32 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-slate-700"
                      placeholder="e.g., We possess a proprietary dataset of 500M points that is not public..."
                   ></textarea>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      Team Background <InfoTooltip text={tooltips.ragTeam} />
                   </label>
                   <p className="text-xs text-slate-500 mb-2">Why is this the *only* team that can build this?</p>
                   <textarea 
                      value={formData.teamBackground}
                      onChange={(e) => handleChange('teamBackground', e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg p-4 h-32 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-slate-700"
                      placeholder="e.g., Founders are ex-DeepMind and ex-Pfizer computational biologists..."
                   ></textarea>
                </div>
             </div>
           )}

           {/* STEP 3: FINANCIALS */}
           {step === 3 && (
             <div className="p-8 md:p-12 space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-center mb-2">
                   <Coins className="h-6 w-6 text-emerald-600 mr-3" />
                   <h2 className="text-2xl font-bold text-slate-900">{t.sections.capital}</h2>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      Use of Funds <InfoTooltip text={tooltips.ragFunds} />
                   </label>
                   <p className="text-xs text-slate-500 mb-2">Be precise. Investors need to know where the leverage goes.</p>
                   <textarea 
                      value={formData.useOfFunds}
                      onChange={(e) => handleChange('useOfFunds', e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-lg p-4 h-32 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none text-slate-700"
                      placeholder="e.g., 60% Compute Credits (H100 Clusters), 30% Hiring (ML Engineers)..."
                   ></textarea>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
                   <Lightbulb className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                   <p className="text-sm text-blue-800">
                      {t.sections.tip}
                   </p>
                </div>
             </div>
           )}

           {/* Footer Navigation */}
           <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-between items-center">
              {step > 1 ? (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 text-slate-600 font-bold hover:text-slate-900 transition-colors"
                >
                  {tCommon.back}
                </button>
              ) : (
                <div></div>
              )}

              <button 
                onClick={handleNext}
                className="flex items-center px-8 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20"
              >
                {step === 3 ? (
                   <>
                     <Save className="h-4 w-4 mr-2" />
                     {tCommon.save}
                   </>
                ) : (
                   <>
                     {tCommon.next}
                     <ChevronRight className="h-4 w-4 ml-2" />
                   </>
                )}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};