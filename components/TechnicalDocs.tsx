
import React from 'react';
import { SQL_SCHEMA_PREVIEW, SMART_CONTRACT_PSEUDO } from '../constants';
import { Database, Code, Server, Layers } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { InfoTooltip } from './InfoTooltip';

interface TechnicalDocsProps {
  language: Language;
}

export const TechnicalDocs: React.FC<TechnicalDocsProps> = ({ language }) => {
  // Defensive access to translations
  const t = TRANSLATIONS[language]?.docs || TRANSLATIONS['EN'].docs || {};
  const tooltips = TRANSLATIONS[language]?.tooltips || TRANSLATIONS['EN'].tooltips || {};
  const diagram = t.diagram || TRANSLATIONS['EN'].docs.diagram || {};
  const api = t.api || TRANSLATIONS['EN'].docs.api || { deposit: {}, burn: {}, liquidate: {} };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl font-bold text-slate-900 mb-4">{t.title}</h1>
          <p className="text-lg text-slate-600">{t.subtitle}</p>
        </div>

        {/* Deliverable 1: Architecture Diagram */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-12">
           <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-4">
              <Layers className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  {t.archTitle} <InfoTooltip text={tooltips.archDiagram} />
              </h2>
           </div>
           
           <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-6 overflow-hidden flex justify-center">
              <svg viewBox="0 0 800 400" className="w-full max-w-3xl">
                 {/* Core Layers */}
                 <rect x="50" y="50" width="200" height="300" rx="8" fill="#fff" stroke="#94a3b8" strokeDasharray="4 4" />
                 <text x="150" y="80" textAnchor="middle" className="text-xs fill-slate-500 font-bold tracking-widest">{diagram.frontend}</text>
                 
                 <rect x="300" y="50" width="200" height="300" rx="8" fill="#fff" stroke="#94a3b8" strokeDasharray="4 4" />
                 <text x="400" y="80" textAnchor="middle" className="text-xs fill-slate-500 font-bold tracking-widest">{diagram.backend}</text>
                 
                 <rect x="550" y="50" width="200" height="300" rx="8" fill="#fff" stroke="#94a3b8" strokeDasharray="4 4" />
                 <text x="650" y="80" textAnchor="middle" className="text-xs fill-slate-500 font-bold tracking-widest">{diagram.trust}</text>

                 {/* Components */}
                 <rect x="70" y="120" width="160" height="40" rx="4" fill="#eff6ff" stroke="#3b82f6" />
                 <text x="150" y="145" textAnchor="middle" className="text-xs fill-blue-800 font-bold">React / Next.js</text>

                 <rect x="320" y="120" width="160" height="40" rx="4" fill="#f0fdf4" stroke="#22c55e" />
                 <text x="400" y="145" textAnchor="middle" className="text-xs fill-green-800 font-bold">Oracle Service (Node)</text>

                 <rect x="320" y="200" width="160" height="40" rx="4" fill="#fefce8" stroke="#eab308" />
                 <text x="400" y="225" textAnchor="middle" className="text-xs fill-yellow-800 font-bold">Permissions DB</text>

                 <rect x="570" y="120" width="160" height="40" rx="4" fill="#faf5ff" stroke="#a855f7" />
                 <text x="650" y="145" textAnchor="middle" className="text-xs fill-purple-800 font-bold">Ethers.js (Read)</text>

                 <rect x="570" y="200" width="160" height="40" rx="4" fill="#f8fafc" stroke="#64748b" />
                 <text x="650" y="225" textAnchor="middle" className="text-xs fill-slate-800 font-bold">Plaid API</text>

                 {/* Connectors */}
                 <path d="M230 140 L320 140" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow-tech)" />
                 <path d="M480 140 L570 140" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow-tech)" />
                 <path d="M400 160 L400 200" stroke="#cbd5e1" strokeWidth="2" />
                 <path d="M480 220 L570 220" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

                 <defs>
                    <marker id="arrow-tech" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                       <path d="M0,0 L0,6 L9,3 z" fill="#cbd5e1" />
                    </marker>
                 </defs>
              </svg>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           
           {/* Deliverable 2: Database Schema */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                 <Database className="h-6 w-6 text-primary-600" />
                 <h2 className="text-lg font-bold text-slate-900 flex items-center">
                    {t.schemaTitle} <InfoTooltip text={tooltips.dbSchema} />
                 </h2>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                 <pre className="text-xs font-mono text-blue-200 leading-relaxed">
                    {SQL_SCHEMA_PREVIEW}
                 </pre>
              </div>
           </div>

           {/* Deliverable 3: Oracle Logic */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                 <Code className="h-6 w-6 text-primary-600" />
                 <h2 className="text-lg font-bold text-slate-900 flex items-center">
                    {t.contractTitle} <InfoTooltip text={tooltips.smartContract} />
                 </h2>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                 <pre className="text-xs font-mono text-purple-200 leading-relaxed">
                    {SMART_CONTRACT_PSEUDO}
                 </pre>
              </div>
           </div>

           {/* Deliverable 4: API Endpoints */}
           <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                 <Server className="h-6 w-6 text-primary-600" />
                 <h2 className="text-lg font-bold text-slate-900 flex items-center">
                    {t.apiTitle} <InfoTooltip text={tooltips.apiEndpoints} />
                 </h2>
              </div>
              <div className="space-y-4">
                 <div className="flex items-start p-3 bg-slate-50 rounded-md border border-slate-200">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold mr-3 font-mono">{api.deposit.method}</span>
                    <div className="flex-1">
                       <p className="font-mono text-sm font-bold text-slate-800">/api/v1/oracle/register-wallet <InfoTooltip text="Register an EVM-compatible address to the Escrow Monitoring Network." /></p>
                       <p className="text-xs text-slate-500 mt-1">{api.deposit.desc}</p>
                    </div>
                 </div>
                 <div className="flex items-start p-3 bg-slate-50 rounded-md border border-slate-200">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold mr-3 font-mono">{api.burn.method}</span>
                    <div className="flex-1">
                       <p className="font-mono text-sm font-bold text-slate-800">/api/v1/growth-data/roas <InfoTooltip text="Securely feed unit economics data into the triangular financing model." /></p>
                       <p className="text-xs text-slate-500 mt-1">{api.burn.desc}</p>
                    </div>
                 </div>
                 <div className="flex items-start p-3 bg-slate-50 rounded-md border border-slate-200">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold mr-3 font-mono">{api.liquidate.method}</span>
                    <div className="flex-1">
                       <p className="font-mono text-sm font-bold text-slate-800">/api/v1/compliance/report-breach <InfoTooltip text="Trigger institutional liquidation protocol if covenants are violated." /></p>
                       <p className="text-xs text-slate-500 mt-1">{api.liquidate.desc}</p>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};
