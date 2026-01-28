
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './views/Dashboard';
import Subscriptions from './views/Subscriptions';
import SyncAccounts from './views/SyncAccounts';
import Vault from './views/Vault';
import Expenses from './views/Expenses';
import Pricing from './views/Pricing';
import { AppProvider, useApp } from './AppContext';
// Added missing RefreshCw to the lucide-react import list
import { Settings, Moon, Sun, Trash2, Download, ChevronRight, EyeOff, ShieldCheck, Zap, Bell, Mail, RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const { theme, toggleTheme, user, updateConsents, purgeAllData } = useApp();
  
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <div className="min-h-screen flex selection:bg-indigo-500/30">
      <Navigation />
      
      <main className="flex-1 px-4 md:px-12 pt-10 pb-32 md:pb-12 md:ml-80 max-w-7xl mx-auto w-full overflow-y-auto h-screen no-scrollbar">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/sync" element={<SyncAccounts />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/upgrade" element={<Pricing />} />
          <Route path="/settings" element={
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl border-white/10">
                  <Settings className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Settings</h1>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Personalize your experience</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-8 md:p-10 rounded-[3rem] space-y-8 shadow-sm border-white/10">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-500" /> Global Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    <ConfigToggle 
                      label="Dark Mode" 
                      enabled={theme === 'dark'} 
                      onToggle={toggleTheme} 
                      icon={theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400"/> : <Sun className="w-4 h-4 text-amber-500"/>}
                    />
                    <ConfigToggle 
                      label="Push Intelligence" 
                      enabled={user.consents.pushNotifications} 
                      onToggle={() => updateConsents({ pushNotifications: !user.consents.pushNotifications })} 
                      icon={<Bell className="w-4 h-4 text-rose-500"/>}
                    />
                    <ConfigToggle 
                      label="Email Summaries" 
                      enabled={user.consents.emailNotifications} 
                      onToggle={() => updateConsents({ emailNotifications: !user.consents.emailNotifications })} 
                      icon={<Mail className="w-4 h-4 text-blue-500"/>}
                    />
                    <ConfigToggle 
                      label="AI Hub Auto-Audit" 
                      enabled={user.consents.emailSync} 
                      onToggle={() => updateConsents({ emailSync: !user.consents.emailSync })} 
                      icon={<RefreshCw className="w-4 h-4 text-indigo-500"/>}
                    />
                  </div>
                </div>

                <div className="glass p-8 md:p-10 rounded-[3rem] space-y-8 shadow-sm border-white/10">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" /> Privacy & Security
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-5 bg-white/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl transition-all group shadow-inner">
                      <div className="flex items-center gap-4">
                        <Download className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300">Export All Data</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                    <button onClick={purgeAllData} className="w-full flex items-center justify-between p-5 bg-rose-500/5 hover:bg-rose-500/10 rounded-2xl transition-all group border border-transparent hover:border-rose-500/20">
                      <div className="flex items-center gap-4">
                        <EyeOff className="w-5 h-5 text-rose-500" />
                        <span className="text-sm font-black text-rose-600 dark:text-rose-400">Clear Local Cache</span>
                      </div>
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

const ConfigToggle: React.FC<{ label: string, enabled: boolean, onToggle: () => void, icon?: React.ReactNode }> = ({ label, enabled, onToggle, icon }) => (
  <div className="flex items-center justify-between p-5 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/10">
    <div className="flex items-center gap-4">
      {icon && <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border dark:border-white/5">{icon}</div>}
      <span className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">{label}</span>
    </div>
    <div 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 relative flex items-center ${enabled ? 'bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-300 dark:bg-slate-800'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  </div>
);

const App: React.FC = () => (
  <AppProvider><Router><AppContent /></Router></AppProvider>
);

export default App;
