
import React, { useState, useMemo } from 'react';
import { LoanDeal, Language, WalletStatus, InvestmentStage } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertTriangle, EyeOff, Lock, Globe, FileText, XOctagon, Zap, Layers, Rocket, TrendingUp, Users, Clock, Target, DollarSign, Activity, Video, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';
import { InfoTooltip } from './InfoTooltip';

interface LeverageDashboardProps {
  language: Language;
  onViewOpportunity?: (deal: LoanDeal) => void;
  onApproveDeal?: (dealId: string) => void;
  deals: LoanDeal[]; 
}

const StageBadge: React.FC<{ stage: InvestmentStage }> = ({ stage }) => {
  const styles = {
    PRE_SEED: 'bg-purple-900/30 text-purple-300 border-purple-800',
    SEED: 'bg-blue-900/30 text-blue-300 border-blue-800',
    SERIES_A: 'bg-emerald-900/30 text-emerald-300 border-emerald-800',
  };
  const labels = {
    PRE_SEED: 'Pre-Seed',
    SEED: 'Seed Round',
    SERIES_A: 'Series A',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[stage]}`}>
      {labels[stage]}
    </span>
  );
};

const MetricItem: React.FC<{ label: string; value: string; trend?: number; tooltip?: string }> = ({ label, value, trend, tooltip }) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase tracking-wide text-slate-500 font-bold mb-1 flex items-center">
      {label}
      {tooltip && <InfoTooltip text={tooltip} />}
    </span>
    <div className="flex items-baseline space-x-2">
      <span className="text-sm font-mono font-bold text-slate-200">{value}</span>
      {trend && (
        <span className={`text-[10px] ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
);

export const LeverageDashboard: React.FC<LeverageDashboardProps> = ({ language, onViewOpportunity, onApproveDeal, deals }) => {
  const [viewMode, setViewMode] = useState<'DISCOVERY' | 'MONITORING'>('DISCOVERY');
  const [selectedDeal, setSelectedDeal] = useState<LoanDeal>(deals[0]);
  const [confirmApproveId, setConfirmApproveId] = useState<string | null>(null);
  
  const t = TRANSLATIONS[language]?.dashboard || TRANSLATIONS['EN'].dashboard;
  const tCommon = TRANSLATIONS[language]?.common || TRANSLATIONS['EN'].common;
  const tooltips = TRANSLATIONS[language]?.tooltips || TRANSLATIONS['EN'].tooltips;

  const historyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      month: `M-${6 - i}`,
      spend: (selectedDeal.growthMetrics.monthlyAdSpend || 50000) + (Math.random() * 5000 - 2500),
      efficiency: (selectedDeal.growthMetrics.roas || 2) * (1 + (Math.random() * 0.1 - 0.05)),
    }));
  }, [selectedDeal]);

  const handleBooking = (e: React.MouseEvent, companyName: string) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Founder Intro: ${companyName}`);
    const details = encodeURIComponent(`Discussing triangular financing structure via CREDEMA.Finance.\n\nAgenda:\n1. Unit Economics\n2. Escrow Setup\n3. Leverage Terms`);
    window.open(`https://calendar.google.com/calendar/u/0/r/eventedit?text=${text}&details=${details}&location=Google+Meet`, '_blank');
  };

  const handleConfirmApprove = () => {
    if (confirmApproveId && onApproveDeal) {
      onApproveDeal(confirmApproveId);
      setConfirmApproveId(null);
      const deal = deals.find(d => d.id === confirmApproveId);
      if (deal) setSelectedDeal({ ...deal, status: 'ACTIVE' }); 
      setViewMode('MONITORING');
    }
  };

  const renderDiscoveryCard = (deal: LoanDeal) => {
    const isEarly = deal.stage === 'PRE_SEED' || deal.stage === 'SEED';
    const depositPercentage = deal.leverageAmount > 0 
        ? ((deal.depositAmount / deal.leverageAmount) * 100).toFixed(1)
        : '0.0';
    
    return (
      <div key={deal.id} className="bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-600 transition-all duration-300 overflow-hidden group flex flex-col h-full relative">
        {/* Card Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800/50">
          <div className="flex justify-between items-start mb-4">
             <div className="h-10 w-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-serif text-lg font-bold text-slate-400">
                {deal.companyName.charAt(0)}
             </div>
             <div className="flex items-center space-x-2">
                {deal.status === 'ACTIVE' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-green-900/30 text-green-300 border-green-800">
                        {t.status.ACTIVE}
                    </span>
                )}
                <StageBadge stage={deal.stage} />
             </div>
          </div>
          <h3 className="text-xl font-bold text-white font-serif mb-1">{deal.companyName}</h3>
          <p className="text-xs text-slate-400 font-medium mb-3">{deal.tagline}</p>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
             <Globe className="h-3 w-3" /> <span>{deal.sector}</span>
          </div>
        </div>

        {/* The Ask / Financials */}
        <div className="p-4 grid grid-cols-2 gap-4 bg-slate-950/30 border-b border-slate-800">
           <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center">
                 {t.raising} <InfoTooltip text={tooltips.raising} />
              </p>
              <p className="text-base font-mono font-bold text-white">${(deal.raisingAmount / 1000000).toFixed(1)}M</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center justify-end">
                 <InfoTooltip text={tooltips.valCap} /> 
                 <span className="ml-1">{deal.valuationType === 'CAP' ? 'Val Cap' : deal.valuationType === 'PRE' ? 'Pre-Money' : 'Post-Money'}</span>
              </p>
              <p className="text-base font-mono font-bold text-primary-400">${(deal.valuation / 1000000).toFixed(1)}M</p>
           </div>
           <div className="col-span-2 flex justify-between items-center pt-2 border-t border-slate-800/50">
              <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 flex items-center">
                 {t.instrument}: <span className="text-slate-300 font-bold mx-1">{deal.instrument.replace('_', ' ')}</span> <InfoTooltip text={tooltips.instrument} />
              </span>
              <span className="text-[10px] text-slate-500 flex items-center">
                 Min: ${(deal.minTicket / 1000).toFixed(0)}k <InfoTooltip text={tooltips.minTicket} />
              </span>
           </div>
           {/* Founder Deposit & Leverage Info */}
           <div className="col-span-2 flex justify-between items-center pt-2 mt-1 border-t border-slate-800/50 bg-slate-900/30 p-2 rounded">
                <div className="flex items-center">
                    <Lock className="h-3 w-3 text-emerald-500 mr-1.5" />
                    <div>
                        <p className="text-[9px] text-slate-500 uppercase font-bold leading-none mb-0.5 flex items-center">
                            {t.founderDeposit} <InfoTooltip text={tooltips.founderDeposit} />
                        </p>
                        <p className="text-xs font-mono font-bold text-emerald-400 leading-none">
                            {deal.depositAmount > 0 ? `$${(deal.depositAmount / 1000).toFixed(0)}k` : 'Pending'}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] text-slate-500 uppercase font-bold leading-none mb-0.5 flex items-center justify-end">
                        <InfoTooltip text={tooltips.depositPct} /> <span className="ml-1">{t.depositPct}</span>
                    </p>
                    <p className="text-xs font-mono font-bold text-blue-400 leading-none">
                        {depositPercentage}%
                    </p>
                </div>
           </div>
        </div>

        {/* Health Dashboard (Dynamic KPIs) */}
        <div className="p-6 flex-1 space-y-4">
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Performance Signals</p>
           
           <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {isEarly ? (
                  <MetricItem label={t.monthlyBurn} value={`$${(deal.productMetrics.burnRate! / 1000).toFixed(0)}k`} tooltip={tooltips.monthlyBurn} />
              ) : (
                  <MetricItem label={t.arr} value={`$${(deal.growthMetrics.arr! / 1000000).toFixed(1)}M`} trend={deal.growthMetrics.yoyGrowth} tooltip={tooltips.arr} />
              )}

              {isEarly ? (
                  <MetricItem label={t.waitlist} value={deal.productMetrics.waitlistSize?.toLocaleString() || deal.productMetrics.betaUsers.toLocaleString()} tooltip={tooltips.waitlist} />
              ) : (
                  <MetricItem label={t.nrr} value={`${deal.growthMetrics.nrr}%`} tooltip={tooltips.nrr} />
              )}

              {isEarly ? (
                  <MetricItem label={t.runway} value={`${deal.productMetrics.runwayMonths} ${t.detail.months}`} tooltip={tooltips.runway} />
              ) : (
                  <MetricItem label={t.ltvCac} value={`${(deal.growthMetrics.ltv! / deal.growthMetrics.cac).toFixed(1)}x`} tooltip={tooltips.ltvCac} />
              )}
              
              {isEarly ? (
                  <MetricItem label={t.teamSize} value={deal.productMetrics.teamSize?.toString() || 'N/A'} tooltip={tooltips.teamSize} />
              ) : (
                  <MetricItem label={t.adSpend} value={`$${(deal.growthMetrics.monthlyAdSpend / 1000).toFixed(0)}k`} tooltip={tooltips.adSpend} />
              )}
           </div>

           <div className="mt-4 p-3 bg-blue-900/10 border border-blue-900/30 rounded-lg">
              <div className="flex items-start">
                 <Target className="h-4 w-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                 <p className="text-xs text-blue-200 italic leading-relaxed">"{deal.investorNote}"</p>
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-3">
           <div className="grid grid-cols-2 gap-3">
               {deal.status === 'ACTIVE' ? (
                   <button 
                     type="button"
                     onClick={() => { setSelectedDeal(deal); setViewMode('MONITORING'); }}
                     className="px-3 py-2 bg-green-900/20 text-green-400 text-xs font-bold rounded border border-green-800 flex items-center justify-center"
                   >
                      <Activity className="h-3 w-3 mr-1" /> {t.actions.active}
                   </button>
               ) : (
                   <button 
                     type="button"
                     onClick={(e) => { e.stopPropagation(); setConfirmApproveId(deal.id); }}
                     className="px-3 py-2 bg-slate-100 text-slate-900 text-xs font-bold rounded hover:bg-white transition-colors border border-slate-200 shadow-md flex items-center justify-center"
                   >
                      {t.actions.approve}
                   </button>
               )}
               <button 
                 type="button"
                 onClick={() => onViewOpportunity && onViewOpportunity(deal)}
                 className="px-3 py-2 bg-primary-700 text-white text-xs font-bold rounded hover:bg-primary-600 transition-colors shadow-lg shadow-primary-900/20"
               >
                  {t.actions.view}
               </button>
           </div>
           
           <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
               <button 
                  type="button"
                  onClick={(e) => handleBooking(e, deal.companyName)}
                  className="flex items-center text-[10px] font-bold text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors border border-slate-700"
               >
                  <Video className="h-3 w-3 mr-1.5 text-red-500" />
                  {t.actions.bookFounder}
               </button>
               <div className="flex items-center text-[9px] text-slate-500">
                  <Sparkles className="h-3 w-3 mr-1 text-purple-500 animate-pulse" />
                  {t.actions.aiConsole}
               </div>
           </div>
        </div>
      </div>
    );
  };

  const renderMonitoringView = () => {
    const activeDeals = deals.filter(d => d.status === 'ACTIVE');
    const displayDeal = activeDeals.find(d => d.id === selectedDeal.id) || activeDeals[0] || selectedDeal;
    const depositPct = displayDeal.leverageAmount > 0 
        ? ((displayDeal.depositAmount / displayDeal.leverageAmount) * 100).toFixed(1)
        : '0.0';

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Left Sidebar: Deal List */}
        <div className="lg:col-span-3 space-y-4">
           <button 
             onClick={() => setViewMode('DISCOVERY')} 
             className="w-full mb-4 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-bold text-slate-200 flex items-center justify-center transition-colors"
           >
              {t.tabs.back}
           </button>
           <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">{t.tabs.yourPortfolio}</h3>
           <div className="space-y-2">
              {activeDeals.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-xs italic bg-slate-900 rounded-lg border border-slate-800">
                      No active loans. Approve a deal in the marketplace to start monitoring.
                  </div>
              ) : (
                  activeDeals.map((deal) => (
                    <div 
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        displayDeal.id === deal.id 
                          ? 'bg-slate-800 border-primary-500 shadow-md' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                         <span className="font-bold text-slate-200 text-sm">{deal.companyName}</span>
                         {deal.walletStatus === WalletStatus.BREACH && <AlertTriangle className="h-3 w-3 text-red-500" />}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                         <span>${(deal.leverageAmount / 1000000).toFixed(1)}M Loan</span>
                         <span className={deal.growthMetrics.roas < 3 ? 'text-orange-400' : 'text-green-400'}>{deal.growthMetrics.roas}x ROAS</span>
                      </div>
                    </div>
                  ))
              )}
           </div>
        </div>

        {/* Main Monitoring Panel */}
        <div className="lg:col-span-9 space-y-6">
           {!displayDeal ? (
               <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                   <p>Select a deal to monitor.</p>
               </div>
           ) : (
             <>
               <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex justify-between items-center">
                  <div>
                     <div className="flex items-center space-x-3 mb-1">
                        <h2 className="text-2xl font-bold text-white font-serif">{displayDeal.companyName}</h2>
                        <StageBadge stage={displayDeal.stage} />
                     </div>
                     <p className="text-slate-400 text-sm flex items-center font-mono">
                        ID: {displayDeal.id} • {displayDeal.sector}
                     </p>
                  </div>
                  <div className="text-right hidden md:block">
                      <div className="text-xs text-slate-500 uppercase font-bold mb-1">Next Oracle Sync</div>
                      <div className="flex items-center text-slate-300 font-mono">
                         <Clock className="h-3 w-3 mr-1" /> {displayDeal.lastOracleCheck}
                      </div>
                  </div>
               </div>

               {/* Live Telemetry Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4">
                        <Lock className={`h-5 w-5 ${displayDeal.walletStatus === WalletStatus.VERIFIED ? 'text-green-500' : 'text-red-500'}`} />
                     </div>
                     <p className="text-sm text-slate-400 font-medium mb-4 flex items-center">
                        {t.detail.collateral} <InfoTooltip text={tooltips.collateral} />
                     </p>
                     <div className="flex justify-between items-end mb-2">
                        <div className="flex flex-col">
                           <span className={`text-2xl font-mono font-bold ${displayDeal.walletStatus === WalletStatus.VERIFIED ? 'text-green-400' : 'text-red-500'}`}>
                               {displayDeal.walletStatus === WalletStatus.VERIFIED ? 'SECURED' : 'BREACH'}
                           </span>
                           <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Ratio: {depositPct}% <InfoTooltip text={tooltips.depositPct} /></span>
                        </div>
                        <span className="text-xs text-slate-500 mb-1">{displayDeal.walletAddress.substring(0,8)}...</span>
                     </div>
                     <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${displayDeal.walletStatus === WalletStatus.VERIFIED ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: '100%' }}></div>
                     </div>
                     <p className="text-xs text-slate-500 mt-2 text-right">
                        Deposit: {displayDeal.depositAmount > 0 ? `$${(displayDeal.depositAmount / 1000).toFixed(0)}k` : 'N/A'}
                     </p>
                  </div>

                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                     <p className="text-sm text-slate-400 font-medium mb-4 flex items-center">
                        {t.detail.burn} <InfoTooltip text={tooltips.burn} />
                     </p>
                     <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-mono font-bold text-white">
                           ${(displayDeal.growthMetrics.monthlyAdSpend / 1000).toFixed(0)}k
                        </span>
                        <span className="text-sm text-slate-500">/mo</span>
                     </div>
                  </div>

                   <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                     <p className="text-sm text-slate-400 font-medium mb-4 flex items-center">
                        {t.detail.dscr} <InfoTooltip text={tooltips.dscr} />
                     </p>
                     <div className="flex items-baseline space-x-2">
                        <span className={`text-3xl font-mono font-bold ${displayDeal.growthMetrics.roas < 3 ? 'text-orange-400' : 'text-white'}`}>
                           {displayDeal.growthMetrics.roas}x
                        </span>
                        <span className="text-sm text-slate-500">ROAS</span>
                     </div>
                     <div className="mt-2 text-xs text-slate-500">Target: 3.0x <InfoTooltip text={tooltips.minCovenant} /></div>
                  </div>
               </div>

               {/* Charts Section */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                     <h4 className="text-sm font-semibold text-slate-400 mb-6 flex items-center">
                        {t.detail.cashflow} <InfoTooltip text={tooltips.cashflow} />
                     </h4>
                     <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={historyData}>
                              <defs>
                                 <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                              <Area type="monotone" dataKey="spend" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                   <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 relative overflow-hidden">
                     <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center border border-slate-800/50 m-2 rounded-lg">
                        <EyeOff className="h-12 w-12 text-slate-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-300 mb-2">{t.detail.restricted} <InfoTooltip text="Restricted data is only visible to validated Seed Investors." /></h3>
                        <p className="text-sm text-slate-500 max-w-xs">{t.detail.restrictedMsg}</p>
                     </div>
                     <h4 className="text-sm font-semibold text-slate-400 mb-6 blur-sm">Product Data</h4>
                     <div className="h-64 w-full blur-sm opacity-30">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={historyData}>
                              <Bar dataKey="efficiency" fill="#64748b" />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
             </>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-20 min-h-screen bg-slate-950 text-slate-200 relative">
      
      {/* Confirmation Modal */}
      {confirmApproveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
           <div className="bg-white rounded-xl max-w-md w-full p-6 text-slate-900 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center mb-4">
                 <CheckCircle2 className="h-8 w-8 text-green-600 mr-3" />
                 <h3 className="text-xl font-bold font-serif">{t.modal.title}</h3>
              </div>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                 {t.modal.desc} <strong>{deals.find(d => d.id === confirmApproveId)?.companyName}</strong>. 
                 {t.modal.desc2}
              </p>
              <div className="flex space-x-3 justify-end">
                 <button 
                   onClick={() => setConfirmApproveId(null)}
                   className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                 >
                    {tCommon.cancel}
                 </button>
                 <button 
                   onClick={handleConfirmApprove}
                   className="px-6 py-2 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
                 >
                    {t.modal.sign}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Global Header Stats */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 flex justify-between items-center">
               <div>
                  <p className="text-[10px] text-slate-500 uppercase font-mono flex items-center">
                     {t.header.deployment} <InfoTooltip text={tooltips.deployment} />
                  </p>
                  <p className="text-lg font-mono font-bold text-white">$42.5M</p>
               </div>
               <Activity className="h-5 w-5 text-slate-600" />
            </div>
             <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 flex justify-between items-center">
               <div>
                 <p className="text-[10px] text-slate-500 uppercase font-mono flex items-center">
                    {t.header.apy} <InfoTooltip text={tooltips.apy} />
                 </p>
                 <p className="text-lg font-mono font-bold text-green-400">11.4%</p>
               </div>
               <TrendingUp className="h-5 w-5 text-green-900" />
            </div>
             <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 flex justify-between items-center">
               <div>
                 <p className="text-[10px] text-slate-500 uppercase font-mono">Active Deals</p>
                 <p className="text-lg font-mono font-bold text-blue-400">{deals.filter(d => d.status === 'ACTIVE').length}</p>
               </div>
               <Layers className="h-5 w-5 text-blue-900" />
            </div>
             <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 flex justify-between items-center">
               <div>
                 <p className="text-[10px] text-slate-500 uppercase font-mono">Open Rounds</p>
                 <p className="text-lg font-mono font-bold text-purple-400">{deals.filter(d => d.status === 'PENDING').length}</p>
               </div>
               <Rocket className="h-5 w-5 text-purple-900" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-6 border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar">
           <button 
             onClick={() => setViewMode('DISCOVERY')}
             className={`pb-4 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${viewMode === 'DISCOVERY' ? 'text-white border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}`}
           >
              {t.tabs.discovery}
           </button>
           <button 
             onClick={() => setViewMode('MONITORING')}
             className={`pb-4 text-sm font-bold uppercase tracking-wide transition-colors whitespace-nowrap ${viewMode === 'MONITORING' ? 'text-white border-b-2 border-primary-500' : 'text-slate-500 hover:text-slate-300'}`}
           >
              {t.tabs.monitoring}
           </button>
        </div>

        {viewMode === 'DISCOVERY' ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              {deals.map(deal => renderDiscoveryCard(deal))}
           </div>
        ) : (
           renderMonitoringView()
        )}
      </div>

    </div>
  );
};
