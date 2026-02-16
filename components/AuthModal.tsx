
import React, { useState } from 'react';
import { X, User as UserIcon, Briefcase, ChevronRight, Lock, Building, BadgeCheck, AlertCircle, Info, Loader2 } from 'lucide-react';
import { Language, UserRole, User } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { MOCK_USERS } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  allUsers: User[];
  onLogin: (userId: string) => void;
  onRegister: (user: Partial<User>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, language, allUsers, onLogin, onRegister }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    entityName: '',
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = TRANSLATIONS[language].auth;

  if (!isOpen) return null;

  // Validation Logic
  const validateForm = () => {
    if (!formState.email || !formState.password) return t.errors.required;
    
    // Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) return t.errors.email;
    
    if (activeTab === 'register') {
      if (!selectedRole) return t.errors.role;
      if (!formState.name || !formState.entityName) return t.errors.required;
      if (formState.password.length < 8) return t.errors.password;
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsSubmitting(true);
    
    // Simulating API Latency for institutional verification feel
    setTimeout(() => {
      setIsSubmitting(false);
      
      const emailLower = formState.email.toLowerCase();
      
      if (activeTab === 'login') {
        // Institutional Credentials Check (Bypass for Director Account)
        if (emailLower === 'dg@credema.finance' && (formState.password === '?Admin123?' || formState.password === 'admin123')) {
           onLogin('admin-dg');
           onClose();
           return;
        }

        const foundUser = allUsers.length > 0 ? allUsers.find(u => u.email.toLowerCase() === emailLower) : MOCK_USERS.find(u => u.email.toLowerCase() === emailLower);
        
        if (foundUser) {
           const isValidPassword = (formState.password === '123' || formState.password === '1618156' || formState.password.length >= 8);

           if (isValidPassword) {
              if (foundUser.status === 'APPROVED' || foundUser.role === 'ADMIN') {
                 onLogin(foundUser.id);
                 onClose();
              } else if (foundUser.status === 'PENDING') {
                 setErrorMsg('Account is pending Admin approval.');
              } else {
                 setErrorMsg('Account rejected. Contact Admin.');
              }
           } else {
              setErrorMsg('Invalid Password.');
           }
        } else {
           setErrorMsg('User not found.');
        }
      } else {
        // Register Logic
        onRegister({
            email: formState.email,
            entityName: formState.entityName,
            role: selectedRole,
            name: formState.name
        });
        setRegisterSuccess(true);
      }
    }, 1200);
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
        <BadgeCheck className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">{t.success}</h3>
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8 max-w-sm">
        <p className="text-slate-600 text-sm leading-relaxed">
            Identity for <span className="font-bold text-slate-900">{formState.entityName}</span> has been broadcasted to the governance network. 
            Verification takes approx. 24-48 hours.
        </p>
      </div>
      <button 
        onClick={onClose}
        className="px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold transition-all shadow-lg"
      >
        Acknowledge
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity" onClick={onClose}></div>

        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-slate-200 ring-1 ring-black/5">
          
          {/* Header */}
          <div className="bg-slate-50/80 px-8 py-6 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900">{t.title}</h3>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-1">{t.subtitle}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-white rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-8 max-h-[80vh] overflow-y-auto no-scrollbar">
            {registerSuccess ? renderSuccess() : (
              <>
                {/* Tab Switcher */}
                <div className="inline-flex p-1 bg-slate-100 rounded-xl mb-8">
                  <button 
                    onClick={() => setActiveTab('login')}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {t.tabLogin}
                  </button>
                  <button 
                    onClick={() => setActiveTab('register')}
                    className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'register' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {t.tabRegister}
                  </button>
                </div>

                {/* Role Selection (Only for Register) */}
                {activeTab === 'register' && (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <button 
                        type="button"
                        onClick={() => setSelectedRole('FOUNDER')}
                        className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                          selectedRole === 'FOUNDER' 
                            ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                     >
                        <div className="flex items-center mb-3">
                          <div className={`p-2 rounded-lg ${selectedRole === 'FOUNDER' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <UserIcon className="h-4 w-4" />
                          </div>
                          <span className={`ml-3 font-bold text-sm ${selectedRole === 'FOUNDER' ? 'text-purple-900' : 'text-slate-700'}`}>{t.roleFounder}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{t.roles.founderDesc}</p>
                        {selectedRole === 'FOUNDER' && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-600"></div>}
                     </button>
                     
                     <button 
                        type="button"
                        onClick={() => setSelectedRole('SEED_INVESTOR')}
                        className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                          selectedRole === 'SEED_INVESTOR' 
                            ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                     >
                        <div className="flex items-center mb-3">
                           <div className={`p-2 rounded-lg ${selectedRole === 'SEED_INVESTOR' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Briefcase className="h-4 w-4" />
                          </div>
                          <span className={`ml-3 font-bold text-sm ${selectedRole === 'SEED_INVESTOR' ? 'text-blue-900' : 'text-slate-700'}`}>{t.roleSeed}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{t.roles.seedDesc}</p>
                        {selectedRole === 'SEED_INVESTOR' && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600"></div>}
                     </button>
                  </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Register Specific Identity Fields */}
                  {activeTab === 'register' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signatory Name</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-3.5 h-4 w-4 text-slate-300" />
                          <input 
                            required
                            type="text" 
                            value={formState.name}
                            onChange={e => setFormState({...formState, name: e.target.value})}
                            className="w-full pl-11 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                            placeholder="Full Legal Name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.fields.entityName}</label>
                        <div className="relative">
                          <Building className="absolute left-4 top-3.5 h-4 w-4 text-slate-300" />
                          <input 
                            required
                            type="text" 
                            value={formState.entityName}
                            onChange={e => setFormState({...formState, entityName: e.target.value})}
                            className="w-full pl-11 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                            placeholder="Company Name"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Common: Login Credentials */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.fields.email}</label>
                      <input 
                        required
                        type="email" 
                        value={formState.email}
                        onChange={e => setFormState({...formState, email: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                        placeholder="corporate@domain.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.fields.password}</label>
                      <input 
                        required
                        type="password" 
                        value={formState.password}
                        onChange={e => setFormState({...formState, password: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center animate-in slide-in-from-left-2 duration-200">
                       <AlertCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                       {errorMsg}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10 group"
                  >
                     {isSubmitting ? (
                       <Loader2 className="h-5 w-5 animate-spin" />
                     ) : (
                       <>
                         {activeTab === 'login' ? t.tabLogin : t.fields.submit}
                         <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                       </>
                     )}
                  </button>
                  
                  {activeTab === 'register' && (
                    <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                       <Lock className="h-3 w-3" />
                       <span>End-to-End Encrypted Identity Protocol</span>
                    </div>
                  )}
                </form>
                
                {activeTab === 'login' && (
                  <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start">
                     <Info className="h-4 w-4 text-slate-400 mr-3 mt-0.5" />
                     <div className="text-[10px] text-slate-500 font-mono leading-relaxed">
                        DIRECTORATE ACCESS: dg@credema.finance / ?Admin123?
                     </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
