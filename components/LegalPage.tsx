
import React from 'react';
import { Language, View } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { ArrowLeft, Shield, FileText, AlertTriangle } from 'lucide-react';

interface LegalPageProps {
  language: Language;
  view: View;
  onBack: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ language, view, onBack }) => {
  // Defensive access to translations
  const t = { ...TRANSLATIONS['EN'].legal, ...(TRANSLATIONS[language]?.legal || {}) };

  const getContent = () => {
    switch (view) {
      case View.PRIVACY:
        return { 
          title: t.privacyTitle, 
          content: t.privacyContent, 
          icon: <Shield className="h-8 w-8 text-emerald-600" />,
          color: 'bg-emerald-50 text-emerald-600'
        };
      case View.TERMS:
        return { 
          title: t.termsTitle, 
          content: t.termsContent, 
          icon: <FileText className="h-8 w-8 text-blue-600" />,
          color: 'bg-blue-50 text-blue-600'
        };
      case View.RISK:
        return { 
          title: t.riskTitle, 
          content: t.riskContent, 
          icon: <AlertTriangle className="h-8 w-8 text-orange-600" />,
          color: 'bg-orange-50 text-orange-600'
        };
      default:
        return { 
          title: 'Error', 
          content: ['Page not found'], 
          icon: null, 
          color: 'bg-slate-100' 
        };
    }
  };

  const { title, content, icon, color } = getContent();

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <button 
          onClick={onBack}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {t.backToHome}
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-12">
             <div className={`h-16 w-16 ${color} rounded-2xl flex items-center justify-center mb-6`}>
                {icon}
             </div>
             
             <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-6">{title}</h1>
             
             <div className="prose prose-slate max-w-none">
                {Array.isArray(content) ? content.map((paragraph, idx) => (
                  <p key={idx} className="text-lg text-slate-600 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                )) : (
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {content}
                  </p>
                )}

                <div className="mt-8 space-y-4">
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                </div>
             </div>
          </div>
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
             <span>{t.lastUpdated}: October 24, 2024</span>
             <span className="font-mono">ID: {view}-{language}-2024</span>
          </div>
        </div>

      </div>
    </div>
  );
};
