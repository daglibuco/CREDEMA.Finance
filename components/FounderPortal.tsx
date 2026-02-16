
import React, { useState, useMemo } from 'react';
import { User, LoanDeal, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { 
  ShieldCheck, FileLock, Calculator, Activity, 
  ChevronRight, Upload, Lock, Eye, 
  Terminal, BarChart3, TrendingUp, CheckCircle2,
  AlertCircle, Download, Clock, Info, Shield, Layers, Plus
} from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface FounderPortalProps {
  user: User;
  deals: LoanDeal[];
  language: Language;
}

export const FounderPortal: React.FC<FounderPortalProps> = ({ user, deals, language }) => {
  // Defensive Deep Merge for translations
  const t = { ...TRANSLATIONS['EN'].founderPortal, ...TRANSLATIONS[language]?.founderPortal };
  const tc = { ...TRANSLATIONS['EN'].common, ...TRANSLATIONS[language]?.common };
  const tooltips = { ...TRANSLATIONS['EN'].tooltips, ...TRANSLATIONS[language]?.tooltips };
  
  // Find the deal belonging to this founder
  const founderDeal = deals.find(d => d.ownerId === user.id) || deals[deals.length - 1];
  
  // Simulated State
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'VDR' | 'FINANCE'>('OVERVIEW');
  const [depositSim, setDepositSim] = useState(founderDeal?.depositAmount || 200000);
  const [multiplierSim, setMultiplierSim] = useState(founderDeal?.leverageMultiplier || 5);

  const leverageResult = depositSim * multiplierSim;
  
  // Mock Access Logs
  const accessLogs = [
    { id: '1', user: 'Institutional LP #42', action: 'Viewed Pitch Deck', time: '14 min ago' },
    { id: '2', user: 'Seed VC Partner', action: 'Downloaded Cap Table', time: '1 hour ago' },
    { id: '3', user: 'Directorate Audit', action: 'Verified Escrow Balance', time: '3 hours ago' },
  ];

  if (!founderDeal) {
      return (
          <div className="pt-32 flex flex-col items-center justify-center p-8 text-slate-500">
              <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
              <p className="font-serif text-lg">No active deal associated with your identity.</p>
              <p className="text-sm">Please register your startup via the 'Apply for Funding' section.</p>
          </div>
      );
  }

  const checklist = t.checklist || { title: 'Checklist', identity: 'Identity', financials: 'Financials', escrow: 'Escrow', ai: 'AI' };
  const vdr = t.vdr || { title: 'Vault', subtitle: 'Secure', upload: 'Upload', securityNote: 'Encrypted' };
  const calc = t.calculator || { title: 'Simulator', subtitle: 'Capital', depositLabel: 'Deposit', multiplier: 'Multiplier', equitySaved: 'Equity saved' };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Portal Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8 text-slate-900">
           <div>
              <div className="flex items-center space-x-2 mb-2">
                 <div className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded uppercase tracking-widest">PROTOCAL_CONNECTED</div>
                 <span className="text-slate-400 text-xs font-mono">NODE_HASH: {founderDeal.id}</span>
              </div>
              <h1 className="text-4xl font-serif font-bold tracking-tight">{t.title}</h1>
              <p className="text-slate-500 font-medium flex items-center">
                <ShieldCheck className="h-4 w-4 text-emerald-500 mr-2" />
                {t.subtitle} — {user.entityName}
              </p>
           </div>
           
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {(['OVERVIEW', 'VDR', 'FINANCE'] as const).map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                     activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
                   }`}
                 >
                   {tab === 'OVERVIEW' ? 'Command' : tab === 'VDR' ? 'Vault' : 'Simulator'}
                 </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* LEFT COLUMN */}
           <div className="lg:col-span-8 space-y-8">
              
              {activeTab === 'OVERVIEW' && (
                <>
                  {/* Readiness Checklist */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                       <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center">
                          {checklist.title}
                       </h3>
                       <span className="text-xs font-bold text-emerald-600 font-mono">READY FOR AUDIT</span>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                         { label: checklist.identity, status: 'COMPLETE', time: 'Oct 24' },
                         { label: checklist.financials, status: 'COMPLETE', time: 'Oct 26' },
                         { label: checklist.escrow, status: 'PENDING', time: 'TBD' },
                         { label: checklist.ai, status: 'COMPLETE', time: 'Training Active' }
                       ].map((step, i) => (
                         <div key={i} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${step.status === 'COMPLETE' ? 'bg-emerald-50/20 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                            <div className="flex items-center">
                               <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${step.status === 'COMPLETE' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                  {step.status === 'COMPLETE' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-900 leading-none mb-1">{step.label}</p>
                                  <p className="text-[10px] text-slate-400 font-mono uppercase">{step.time}</p>
                               </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* High Density Tickers */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                        <TrendingUp className="absolute -bottom-4 -right-4 h-24 w-24 text-white opacity-5" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Leverage Headroom</p>
                        <p className="text-3xl font-mono font-bold text-blue-400 mb-1">€{(founderDeal.leverageAmount/1000000).toFixed(1)}M</p>
                        <p className="text-xs text-slate-500">at {founderDeal.leverageMultiplier}x Multiplier</p>
                     </div>
                     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Escrow Provisioned</p>
                        <p className="text-3xl font-mono font-bold text-emerald-600 mb-1">€{(founderDeal.depositAmount/1000).toFixed(0)}k</p>
                        <p className="text-xs text-slate-500">Multisig Wallet 0x...</p>
                     </div>
                     <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Equity Preserved</p>
                        <p className="text-3xl font-mono font-bold text-purple-600 mb-1">32.4%</p>
                        <p className="text-xs text-slate-500">vs Series A Benchmark</p>
                     </div>
                  </div>
                </>
              )}

              {activeTab === 'VDR' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-500 text-slate-900">
                   <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                      <div>
                        <h3 className="text-lg font-bold">{vdr.title}</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">{vdr.subtitle}</p>
                      </div>
                      <button className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded flex items-center hover:bg-slate-100 transition-colors">
                         <Plus className="h-3 w-3 mr-2" /> {vdr.upload}
                      </button>
                   </div>
                   
                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                               <th className="px-6 py-4">Institutional Asset</th>
                               <th className="px-6 py-4">Timestamp</th>
                               <th className="px-6 py-4">Security Protocol</th>
                               <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-50">
                            {[
                              { name: 'PITCH_DECK_Q4_FINAL.pdf', size: '4.2MB', date: 'OCT 24', security: 'DYNAMIC_WATERMARK' },
                              { name: 'CAP_TABLE_SENSITIVE.xlsx', size: '1.1MB', date: 'OCT 25', security: 'ENCRYPTED_AES256' },
                              { name: 'TECHNICAL_INFRA_DOC.pdf', size: '12.8MB', date: 'OCT 26', security: 'WATERMARKED' }
                            ].map((doc, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center">
                                       <div className="p-2 bg-slate-100 rounded text-slate-500 mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                          <FileLock className="h-4 w-4" />
                                       </div>
                                       <div>
                                          <p className="text-xs font-bold text-slate-900 font-mono">{doc.name}</p>
                                          <p className="text-[10px] text-slate-400 font-mono">{doc.size}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-[10px] text-slate-500 font-mono">{doc.date} 2024</td>
                                 <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-[2px] text-[9px] font-bold border font-mono ${doc.security.includes('AES') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                       {doc.security}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button className="p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded"><Eye className="h-4 w-4 text-slate-400" /></button>
                                       <button className="p-1.5 hover:bg-white border border-transparent hover:border-slate-200 rounded"><Download className="h-4 w-4 text-slate-400" /></button>
                                    </div>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                   
                   <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center text-slate-400 text-[10px] font-medium uppercase tracking-tighter">
                      <Lock className="h-3 w-3 mr-2" />
                      {vdr.securityNote}
                   </div>
                </div>
              )}

              {activeTab === 'FINANCE' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 text-slate-900">
                   <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                      <div className="flex items-center space-x-3 mb-10 pb-6 border-b border-slate-100">
                         <Calculator className="h-6 w-6 text-primary-600" />
                         <div>
                            <h3 className="text-xl font-bold">{calc.title}</h3>
                            <p className="text-xs text-slate-500">{calc.subtitle}</p>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-10">
                            <div>
                               <div className="flex justify-between mb-4">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{calc.depositLabel}</label>
                                  <span className="text-lg font-mono font-bold text-slate-900">€{depositSim.toLocaleString()}</span>
                               </div>
                               <input 
                                 type="range" min="50000" max="1000000" step="10000" 
                                 value={depositSim} onChange={e => setDepositSim(Number(e.target.value))}
                                 className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                               />
                            </div>

                            <div>
                               <div className="flex justify-between mb-4">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{calc.multiplier}</label>
                                  <span className="text-lg font-mono font-bold text-blue-600">{multiplierSim}x Leverage</span>
                               </div>
                               <div className="flex gap-2">
                                  {[2, 5, 8, 10].map(m => (
                                    <button 
                                      key={m} 
                                      onClick={() => setMultiplierSim(m)}
                                      className={`flex-1 py-3 rounded-lg border text-xs font-bold transition-all font-mono ${multiplierSim === m ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}`}
                                    >
                                       {m}X
                                    </button>
                                  ))}
                               </div>
                            </div>
                         </div>

                         <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col justify-center items-center text-center">
                            <TrendingUp className="h-10 w-10 text-primary-600 mb-4" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Projected Growth Capital</p>
                            <p className="text-5xl font-mono font-bold text-slate-900 tracking-tight mb-4">€{leverageResult.toLocaleString()}</p>
                            <div className="w-full h-px bg-slate-200 my-6"></div>
                            <div className="flex justify-between w-full text-xs font-bold uppercase tracking-tighter">
                               <span className="text-slate-400">{calc.equitySaved}</span>
                               <span className="text-emerald-600">~28% - 35% PRESERVED</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

           </div>

           {/* RIGHT COLUMN - Terminal */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#0c0d12] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden h-[450px] flex flex-col">
                 <div className="p-4 border-b border-slate-800 bg-[#16181d] flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                       <Terminal className="h-3.5 w-3.5 text-blue-500" />
                       <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tighter">NETWORK_ENGAGEMENT_STREAM</span>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] space-y-4 no-scrollbar">
                    {accessLogs.map(log => (
                       <div key={log.id} className="border-l border-blue-900/50 pl-3">
                          <div className="flex justify-between text-blue-400/70 font-bold mb-1">
                             <span>{log.user}</span>
                             <span className="text-slate-600">{log.time}</span>
                          </div>
                          <div className="text-slate-400">
                             {log.action} <span className="text-slate-700">| CID_{Math.random().toString(36).substring(7).toUpperCase()}</span>
                          </div>
                       </div>
                    ))}
                    <div className="text-slate-700 italic border-l border-slate-800 pl-3">Awaiting next institutional event...</div>
                 </div>
                 
                 <div className="p-3 bg-[#16181d] border-t border-slate-800 flex justify-between items-center">
                    <span className="flex items-center text-[9px] font-bold text-emerald-500 uppercase tracking-widest"><Activity className="h-2 w-2 mr-1" /> System Ready</span>
                    <span className="text-[9px] font-mono text-slate-600">ZURICH_NODE_4.2</span>
                 </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                 <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-5 w-5 text-emerald-500" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Protocol Governance</h4>
                 </div>
                 <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    All institutional sessions are cryptographically logged. Data Room downloads trigger an automated notification to your corporate email.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
