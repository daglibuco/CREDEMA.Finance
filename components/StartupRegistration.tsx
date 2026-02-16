
import React, { useState, useEffect } from 'react';
import { Language, StartupRAGContext, InvestmentStage, InstrumentType } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { Rocket, DollarSign, Brain, CheckCircle2, AlertCircle, Save, ArrowRight, User as UserIcon, MapPin, Building, FileText, Lock } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface StartupRegistrationProps {
  language: Language;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const StartupRegistration: React.FC<StartupRegistrationProps> = ({ language, onSubmit, onCancel }) => {
  const t = TRANSLATIONS[language].register;
  const tRag = TRANSLATIONS[language].rag;
  const tooltips = TRANSLATIONS[language].tooltips;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    companyName: '',
    tagline: '',
    location: '',
    sector: '',
    description: '',
    website: '',
    
    // Step 2: Financials
    stage: 'SEED' as InvestmentStage,
    raisingAmount: 0,
    instrument: 'SAFE' as InstrumentType,
    valuation: 0,
    hasDeposit: false,
    leverageNeeded: 0,

    // Step 3: AI Training (RAG)
    ragContext: {
      problem: '',
      solution: '',
      marketStrategy: '',
      competition: 'TBD - To be detailed in due diligence',
      teamBackground: 'TBD - Founder profiles to be ingested',
      useOfFunds: ''
    } as StartupRAGContext
  });

  const handleRagChange = (field: keyof StartupRAGContext, value: string) => {
    setFormData(prev => ({
      ...prev,
      ragContext: { ...prev.ragContext, [field]: value }
    }));
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // CRITICAL AUDIT: Validation must match the required fields for submission
  const isFormValid = () => {
    const basicValid = formData.companyName && formData.location && formData.tagline && formData.sector && formData.description;
    const financeValid = formData.raisingAmount > 0 && formData.valuation > 0 && formData.leverageNeeded > 0;
    // Problem, Solution, and Strategy are required for the AI Twin
    const aiValid = formData.ragContext.problem && formData.ragContext.solution && formData.ragContext.marketStrategy && formData.ragContext.useOfFunds;
    
    return basicValid && financeValid && aiValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
           <h1 className="font-serif text-3xl font-bold text-slate-900 mb-2">{t.title}</h1>
           <p className="text-slate-600">{t.subtitle}</p>
        </div>

        <div className="flex justify-between items-center max-w-2xl mx-auto mb-10 relative">
           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
           {[1, 2, 3].map((s) => (
             <div key={s} className={`flex flex-col items-center cursor-pointer`} onClick={() => setStep(s)}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${
                  step === s ? 'bg-slate-900 text-white ring-4 ring-slate-100' : 
                  step > s ? 'bg-green-500 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}>
                   {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 px-2 text-slate-600">
                  {s === 1 ? t.steps.basics : s === 2 ? t.steps.finance : t.steps.ai}
                </span>
             </div>
           ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
           
           {step === 1 && (
              <div className="p-8 space-y-6 animate-in slide-in-from-right-8">
                 <div className="flex items-center mb-4 pb-4 border-b border-slate-100">
                    <Building className="h-5 w-5 text-blue-600 mr-2" />
                    <h2 className="text-xl font-bold text-slate-900">{t.sections.company}</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.fields.name}</label>
                       <input 
                         required
                         type="text" 
                         value={formData.companyName}
                         onChange={e => setFormData({...formData, companyName: e.target.value})}
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                         placeholder="e.g. Acme AI"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.fields.location}</label>
                       <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <input 
                            required
                            type="text" 
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            className="w-full pl-9 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                            placeholder="City, Country"
                          />
                       </div>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                       <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.fields.tagline}</label>
                       <input 
                         required
                         type="text" 
                         value={formData.tagline}
                         onChange={e => setFormData({...formData, tagline: e.target.value})}
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                         placeholder="Short catchy pitch (Max 60 chars)"
                         maxLength={60}
                       />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                       <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.fields.sector}</label>
                       <select 
                         required
                         value={formData.sector}
                         onChange={e => setFormData({...formData, sector: e.target.value})}
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                       >
                         <option value="">Select Sector</option>
                         <option value="B2B SaaS">B2B SaaS (Software)</option>
                         <option value="FinTech">FinTech (Finance)</option>
                         <option value="DeepTech">DeepTech / AI / Robotics</option>
                         <option value="MedTech">MedTech / Health</option>
                         <option value="CleanTech">CleanTech / Energy</option>
                         <option value="Other">Other</option>
                       </select>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                       <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.fields.description}</label>
                       <textarea 
                         required
                         value={formData.description}
                         onChange={e => setFormData({...formData, description: e.target.value})}
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none h-32"
                         placeholder="Detailed description of your product and vision..."
                       />
                    </div>
                 </div>
              </div>
           )}

           {step === 2 && (
              <div className="p-8 space-y-6 animate-in slide-in-from-right-8">
                 <div className="flex items-center mb-4 pb-4 border-b border-slate-100">
                    <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                    <h2 className="text-xl font-bold text-slate-900">{t.sections.funding}</h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.fields.stage}</label>
                       <select 
                         value={formData.stage}
                         onChange={e => setFormData({...formData, stage: e.target.value as InvestmentStage})}
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                       >
                         <option value="PRE_SEED">Pre-Seed</option>
                         <option value="SEED">Seed</option>
                         <option value="SERIES_A">Series A</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.fields.instrument}</label>
                       <select 
                         value={formData.instrument}
                         onChange={e => setFormData({...formData, instrument: e.target.value as InstrumentType})}
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                       >
                         <option value="SAFE">SAFE (Y-Combinator)</option>
                         <option value="CONVERTIBLE_NOTE">Convertible Note</option>
                         <option value="PRICED_EQUITY">Priced Equity Round</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.fields.raising} (€)</label>
                       <input 
                         required
                         type="number" 
                         value={formData.raisingAmount}
                         onChange={e => setFormData({...formData, raisingAmount: Number(e.target.value)})}
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                         placeholder="2000000"
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-600 uppercase mb-1">{t.fields.valuation} (€)</label>
                       <input 
                         required
                         type="number" 
                         value={formData.valuation}
                         onChange={e => setFormData({...formData, valuation: Number(e.target.value)})}
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                         placeholder="10000000"
                       />
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-blue-50 p-6 rounded-xl border border-blue-100">
                       <h3 className="font-bold text-blue-900 mb-4">{t.sections.leverage}</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                             <label className="block text-xs font-bold text-blue-700 uppercase mb-1">{t.fields.leverageAsk} (€)</label>
                             <input 
                               required
                               type="number" 
                               value={formData.leverageNeeded}
                               onChange={e => setFormData({...formData, leverageNeeded: Number(e.target.value)})}
                               className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                             />
                          </div>
                          <div className="flex items-center">
                             <input 
                               type="checkbox" 
                               id="hasDeposit"
                               checked={formData.hasDeposit}
                               onChange={e => setFormData({...formData, hasDeposit: e.target.checked})}
                               className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                             />
                             <label htmlFor="hasDeposit" className="ml-3 text-sm text-slate-700">
                                {t.fields.hasDeposit}
                             </label>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {step === 3 && (
              <div className="p-8 space-y-6 animate-in slide-in-from-right-8">
                 <div className="flex items-center mb-4 pb-4 border-b border-slate-100 justify-between">
                    <div className="flex items-center">
                       <Brain className="h-5 w-5 text-purple-600 mr-2" />
                       <h2 className="text-xl font-bold text-slate-900">{t.sections.ai}</h2>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">PROBLEM</label>
                       <textarea 
                          required
                          value={formData.ragContext.problem}
                          onChange={(e) => handleRagChange('problem', e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24"
                          placeholder="The specific pain point you solve..."
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">SOLUTION</label>
                       <textarea 
                          required
                          value={formData.ragContext.solution}
                          onChange={(e) => handleRagChange('solution', e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24"
                          placeholder="Your unique technical or business solution..."
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">MARKET & DISTRIBUTION</label>
                       <textarea 
                          required
                          value={formData.ragContext.marketStrategy}
                          onChange={(e) => handleRagChange('marketStrategy', e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24"
                          placeholder="How do you acquire customers?"
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">USE OF FUNDS</label>
                       <textarea 
                          required
                          value={formData.ragContext.useOfFunds}
                          onChange={(e) => handleRagChange('useOfFunds', e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24"
                          placeholder="Breakdown of growth capital spending..."
                       />
                    </div>
                 </div>
              </div>
           )}

           <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              {step > 1 ? (
                 <button type="button" onClick={handleBack} className="text-slate-500 hover:text-slate-900 font-bold px-4">Back</button>
              ) : (
                 <button type="button" onClick={onCancel} className="text-slate-500 hover:text-red-600 font-bold px-4">Cancel</button>
              )}
              
              {step < 3 ? (
                 <button type="button" onClick={handleNext} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold flex items-center hover:bg-slate-800 transition-colors">
                    Next Step <ArrowRight className="h-4 w-4 ml-2" />
                 </button>
              ) : (
                 <div className="flex items-center space-x-4">
                    {!isFormValid() && <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Fields required for AI Training</span>}
                    <button 
                      type="submit" 
                      disabled={!isFormValid()}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold flex items-center hover:bg-green-500 shadow-lg disabled:opacity-50"
                    >
                       Submit Application <Save className="h-4 w-4 ml-2" />
                    </button>
                 </div>
              )}
           </div>
        </form>
      </div>
    </div>
  );
};
