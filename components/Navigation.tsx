
import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Globe, User as UserIcon, LogOut, ShieldAlert, PlusCircle, ChevronDown, Check, LayoutDashboard } from 'lucide-react';
import { Language, View, User } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { AuthModal } from './AuthModal';
import { StorageService } from '../utils/storage';
import { MOCK_USERS } from '../constants';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User;
  setUser: (user: User) => void;
  allUsers: User[];
  onRegisterUser: (user: Partial<User>) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, language, setLanguage, user, setUser, allUsers, onRegisterUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  
  const t = TRANSLATIONS[language]?.nav || TRANSLATIONS['EN'].nav;

  // The primary items accessible to all visitors
  const navItems = [
    { id: View.ABOUT, label: t.about },
    { id: View.DASHBOARD, label: t.dashboard },
    { id: View.BLOG, label: t.blog },
    { id: View.DOCS, label: t.docs },
    { id: View.FOUNDATIONS, label: t.foundations },
  ];

  const handleLogin = (userId: string) => {
    const foundUser = allUsers.find(u => u.id === userId) || MOCK_USERS.find(u => u.id === userId);
    
    if (foundUser) {
      const loggedInUser = { ...foundUser, isLoggedIn: true };
      setUser(loggedInUser);
      StorageService.setSession(loggedInUser);
      
      if (foundUser.role === 'ADMIN') {
        onViewChange(View.ADMIN);
      } else if (foundUser.role === 'FOUNDER') {
        onViewChange(View.FOUNDER_PORTAL);
      } else {
        onViewChange(View.DASHBOARD);
      }
    }
  };

  const handleLogout = () => {
    const guestUser: User = { 
      id: '', email: '', name: '', role: null, entityName: '', status: 'PENDING', isLoggedIn: false 
    };
    setUser(guestUser);
    StorageService.setSession(null);
    onViewChange(View.LANDING);
    setIsOpen(false);
  };

  const languageOptions: { id: Language; label: string }[] = [
    { id: 'EN', label: 'English' },
    { id: 'DE', label: 'Deutsch' },
    { id: 'FR', label: 'Français' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* LEFT: Logo & Main Navigation */}
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center cursor-pointer group" onClick={() => onViewChange(View.LANDING)}>
                <div className="h-9 w-9 bg-slate-900 rounded-lg flex items-center justify-center mr-3 transition-transform group-hover:scale-105">
                  <ShieldCheck className="text-white h-5.5 w-5.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-lg text-slate-950 tracking-tight leading-none">CREDEMA.Finance</span>
                  <span className="font-sans text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Intermediary Portal</span>
                </div>
              </div>

              {/* Public Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-full transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Language Selector & Login Button */}
            <div className="hidden md:flex items-center space-x-4">
               <div className="flex items-center px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 space-x-3 relative group/lang">
                  <div className="flex items-center space-x-1 cursor-pointer py-1">
                    <Globe className="h-3 w-3 text-slate-400 group-hover/lang:text-primary-500 transition-colors" />
                    <span className="text-[10px] font-bold text-slate-600">{language}</span>
                    <ChevronDown className="h-2 w-2 text-slate-400" />
                  </div>

                  <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-200 z-[100] py-2 overflow-hidden">
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setLanguage(opt.id)}
                        className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors flex justify-between items-center ${
                          language === opt.id ? 'bg-slate-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {opt.label}
                        {language === opt.id && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="h-8 w-px bg-slate-200 mx-1 lg:mx-2"></div>

               <div className="flex items-center space-x-3">
                  {user.isLoggedIn ? (
                    <div className="flex items-center space-x-3">
                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => onViewChange(View.ADMIN)}
                          className={`p-2 rounded-lg transition-colors ${
                            currentView === View.ADMIN ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-50 hover:text-red-500'
                          }`}
                        >
                          <ShieldAlert className="h-5 w-5" />
                        </button>
                      )}
                      
                      {user.role === 'FOUNDER' && (
                        <button
                          onClick={() => onViewChange(View.FOUNDER_PORTAL)}
                          className={`flex items-center px-3 py-1.5 rounded-lg font-bold text-[10px] lg:text-xs transition-all ${
                            currentView === View.FOUNDER_PORTAL ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          {t.profile}
                        </button>
                      )}

                      <div className="hidden lg:flex flex-col items-end mr-1">
                        <span className="text-xs font-bold text-slate-900 leading-none">{user.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">{user.role}</span>
                      </div>
                      <button 
                        onClick={handleLogout} 
                        className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-200"
                        title={t.logout}
                      >
                        <LogOut className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowAuth(true)}
                      className="text-slate-600 hover:text-slate-900 font-bold text-sm flex items-center px-3 py-2 rounded-lg hover:bg-slate-50 transition-all"
                    >
                      <UserIcon className="h-4 w-4 mr-2 text-slate-400" />
                      {t.login}
                    </button>
                  )}

                  {(!user.isLoggedIn || user.role === 'FOUNDER') && (
                    <button 
                        onClick={() => onViewChange(View.REGISTER_STARTUP)}
                        className="hidden lg:flex items-center text-[10px] lg:text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-full hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 hover:shadow-lg active:scale-95"
                    >
                        <PlusCircle className="h-3.5 w-3.5 mr-2" />
                        {t.apply}
                    </button>
                  )}
               </div>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center space-x-2">
              <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2 bg-slate-50 rounded-lg">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-slate-900/10 backdrop-blur-sm z-50">
            <div className="bg-white h-full w-[85%] ml-auto shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                {user.isLoggedIn ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center mr-3">
                        <UserIcon className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{user.role}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setShowAuth(true); setIsOpen(false); }}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center shadow-lg"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    {t.login}
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-colors ${
                       currentView === item.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="p-6 border-t border-slate-100 bg-white">
                <button
                  onClick={() => {
                    onViewChange(View.REGISTER_STARTUP);
                    setIsOpen(false);
                  }}
                  className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center shadow-lg"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  {t.apply}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        language={language}
        allUsers={allUsers}
        onLogin={handleLogin}
        onRegister={onRegisterUser}
      />
    </>
  );
};
