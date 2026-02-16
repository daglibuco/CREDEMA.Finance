import React from 'react';
import { HelpCircle } from 'lucide-react';

export const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group/tooltip relative inline-flex ml-1.5 cursor-help align-middle z-10">
    <HelpCircle className="h-3 w-3 text-slate-400 hover:text-primary-500 transition-colors" />
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-[60]">
      <div className="bg-slate-800 text-slate-200 text-[10px] font-medium rounded-md p-2 shadow-xl border border-slate-700 text-center leading-tight relative">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  </div>
);