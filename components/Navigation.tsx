
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, CreditCard, FileText, Settings, 
  ReceiptText, Plus, Zap, ShieldCheck, Sparkles, RefreshCw, Crown
} from 'lucide-react';
import { useApp, PLAN_LIMITS } from '../AppContext';

const Navigation: React.FC = () => {
  const { isPremium, pendingSync, subscriptions, documents } = useApp();
  const navigate = useNavigate();

  const primaryLinks = [
    { to: '/', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview' },
    { to: '/subscriptions', icon: <CreditCard className="w-5 h-5" />, label: 'Subscriptions' },
    { to: '/sync', icon: <RefreshCw className="w-5 h-5" />, label: 'Sync Hub', badge: pendingSync.length > 0, premium: true },
  ];
  
  const secondaryLinks = [
    { to: '/vault', icon: <FileText className="w-5 h-5" />, label: 'Secure Vault' },
    { to: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Floating Action Dock */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass rounded-[2.5rem] p-2 flex items-center justify-between z-[100] shadow-2xl border border-white/10 ring-1 ring-white/5">
        <div className="flex flex-1 justify-around items-center">
          {primaryLinks.slice(0, 2).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `p-3.5 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'text-slate-400 dark:text-slate-500'}`
              }
            >
              {link.icon}
            </NavLink>
          ))}
        </div>

        <button 
          onClick={() => navigate('/subscriptions')} 
          className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform -translate-y-4 ring-4 ring-white/10"
        >
          <Plus className="w-7 h-7" strokeWidth={3} />
        </button>

        <div className="flex flex-1 justify-around items-center">
          {secondaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `p-3.5 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'text-slate-400 dark:text-slate-500'}`
              }
            >
              {link.icon}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-6 top-6 bottom-6 w-72 glass rounded-[3rem] p-8 z-50 shadow-2xl overflow-hidden border border-white/10">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse">
            <Sparkles className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Subly</h1>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Smart Tracker</span>
          </div>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar">
          {[...primaryLinks, { to: '/expenses', icon: <ReceiptText className="w-5 h-5" />, label: 'Spending' }, ...secondaryLinks].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                }`
              }
            >
              <div className="group-hover:scale-110 transition-transform">{link.icon}</div>
              <span className="text-sm font-bold tracking-tight flex items-center gap-2">
                {link.label}
                {(link as any).premium && !isPremium && <Crown className="w-3 h-3 text-amber-500" />}
              </span>
              {(link as any).badge && (
                <div className="absolute right-6 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
              )}
            </NavLink>
          ))}
        </div>

        <div className="mt-auto space-y-4 pt-8 border-t border-slate-100 dark:border-white/5">
          {/* Usage Stats for Free Users */}
          {!isPremium && (
            <div className="px-2 space-y-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>Trackers</span>
                  <span>{subscriptions.length}/{PLAN_LIMITS.FREE_SUBSCRIPTIONS}</span>
                </div>
                <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-500" 
                    style={{ width: `${(subscriptions.length / PLAN_LIMITS.FREE_SUBSCRIPTIONS) * 100}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>Vault Assets</span>
                  <span>{documents.length}/{PLAN_LIMITS.FREE_DOCUMENTS}</span>
                </div>
                <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${(documents.length / PLAN_LIMITS.FREE_DOCUMENTS) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {isPremium ? (
            <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Premium Node</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Infinite Ledger</p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/20 blur-2xl group-hover:scale-150 transition-transform"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Free Tier</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4 leading-relaxed">AI Sync & Infinite Vault Assets.</p>
              <button 
                onClick={() => navigate('/upgrade')} 
                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-indigo-700 shadow-md active:scale-95"
              >
                Go Premium
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Node</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
