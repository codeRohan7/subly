
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Bell, ShieldCheck, Sparkles, 
  Sun, Moon, AlertTriangle, RefreshCw, CheckCircle2,
  Lock, ArrowUpRight, ChevronRight, TrendingDown, Calendar, Zap, Crown
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useApp } from '../AppContext';
import { getAIInsights } from '../geminiService';
import { AIInsight, SubscriptionStatus } from '../types';
import RenewalCalendar from '../components/RenewalCalendar';
import AlertCenter from '../components/AlertCenter';
import SmartAlertItem from '../components/SmartAlertItem';
import SmartFeatureCard from '../components/SmartFeatureCard';

const Dashboard: React.FC = () => {
  const { subscriptions, expenses, user, theme, toggleTheme, alerts, isPremium } = useApp();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAlertCenterOpen, setIsAlertCenterOpen] = useState(false);

  const activeSubs = subscriptions.filter(sub => sub.status === SubscriptionStatus.ACTIVE);
  const totalMonthlySpend = activeSubs.reduce((acc, sub) => acc + sub.amount, 0);
  const budgetProgress = Math.min((totalMonthlySpend / user.budgetLimit) * 100, 100);
  const isOverBudget = totalMonthlySpend > user.budgetLimit;

  useEffect(() => {
    const fetchInsights = async () => {
      if (!isPremium) return;
      setLoading(true);
      const res = await getAIInsights(subscriptions, expenses);
      setInsights(res);
      setLoading(false);
    };
    fetchInsights();
  }, [subscriptions.length, user.budgetLimit, isPremium]);

  const currencySymbol = user.currency === 'INR' ? '₹' : user.currency === 'EUR' ? '€' : '$';

  return (
    <div className="space-y-10 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            Welcome, <span className="text-indigo-600 dark:text-indigo-400">{user.name.split(' ')[0]}</span>
          </h1>
          <div className="flex items-center gap-2 mt-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
               Subly Intelligence: {isPremium ? 'Full Access' : 'Core Active'}
             </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsAlertCenterOpen(true)} className="p-4 glass rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl relative">
            <Bell className="w-6 h-6 text-indigo-600" />
            {alerts.length > 0 && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-bounce"></span>
            )}
          </button>
          <button onClick={toggleTheme} className="p-4 glass rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
            {theme === 'dark' ? <Sun className="w-6 h-6 text-amber-500" /> : <Moon className="w-6 h-6 text-indigo-600" />}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Main Spending Card */}
          <section className={`glass p-10 md:p-12 rounded-[4rem] relative overflow-hidden shadow-2xl transition-all duration-700 ${isOverBudget ? 'ring-2 ring-rose-500/50' : 'border-white/10'}`}>
            <div className="absolute inset-0 bg-indigo-600/5 opacity-30"></div>
            <div className="flex flex-col md:flex-row gap-12 justify-between items-center relative z-10">
              <div className="text-center md:text-left flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400 mb-2">Aggregate Burn Rate</p>
                <h2 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{currencySymbol}{totalMonthlySpend.toFixed(2)}</h2>
                <div className="mt-12 space-y-4 max-w-sm mx-auto md:mx-0">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Allocation</p>
                      <p className={`text-[11px] font-black uppercase ${budgetProgress > 90 ? 'text-rose-500' : 'text-indigo-600'}`}>{budgetProgress.toFixed(0)}% Used</p>
                   </div>
                   <div className="w-full h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out rounded-full ${budgetProgress > 90 ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${budgetProgress}%` }}
                      ></div>
                   </div>
                </div>
              </div>
              <div className="w-full md:w-5/12 h-64 opacity-60">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[{v:totalMonthlySpend * 0.7}, {v:totalMonthlySpend * 0.85}, {v:totalMonthlySpend}]}>
                      <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={6} fill="transparent" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* AI Insights Section - Gated */}
          {isPremium ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {loading ? [1,2,3].map(i => <div key={i} className="h-32 glass rounded-[2rem] animate-pulse"></div>) : 
               insights.map((insight, idx) => (
                 <div key={idx} className="glass p-6 rounded-[2.5rem] border-white/5 shadow-lg group hover:-translate-y-1 transition-all">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-indigo-600/10 rounded-xl text-indigo-600"><Sparkles className="w-4 h-4" /></div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{insight.title}</h4>
                   </div>
                   <p className="text-[10px] font-bold text-slate-500 leading-tight uppercase tracking-widest">{insight.description}</p>
                 </div>
               ))}
            </div>
          ) : (
            <div 
              onClick={() => navigate('/upgrade')}
              className="glass p-10 rounded-[3rem] bg-indigo-600/5 border-dashed border-2 border-indigo-500/20 flex items-center justify-between group cursor-pointer hover:bg-indigo-600/10 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-[1.75rem] flex items-center justify-center text-amber-500 shadow-xl border border-white/10 group-hover:scale-110 transition-transform">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Unlock AI Deep Insights</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Reveal redundant nodes and budget leakages automatically.</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-indigo-600 opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </div>
          )}

          <RenewalCalendar subscriptions={subscriptions} />
        </div>

        <div className="space-y-8">
          <div className="flex justify-between items-center px-4">
             <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
               <Bell className="w-5 h-5 text-rose-500" /> Alert Stream
             </h3>
             <span className="bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg shadow-rose-200 dark:shadow-none">
               {alerts.length} NODE(S)
             </span>
          </div>
          
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="glass p-16 rounded-[3rem] text-center border-dashed">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-5" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All Nodes Synced</p>
              </div>
            ) : alerts.slice(0, 4).map(alert => (
              <SmartAlertItem 
                key={alert.id} 
                alert={alert} 
                onAction={() => setIsAlertCenterOpen(true)}
              />
            ))}
          </div>

          <SmartFeatureCard 
            title="Secure Vault AI"
            description="Automatic document extraction is now 40% faster. Ready to scan your official identity records?"
            icon={ShieldCheck}
            variant="emerald"
            actionText={isPremium ? "Go to Vault" : "Unlock Pro Vault"}
            onClick={() => navigate(isPremium ? '/vault' : '/upgrade')}
          />
        </div>
      </div>

      {isAlertCenterOpen && <AlertCenter onClose={() => setIsAlertCenterOpen(false)} />}
    </div>
  );
};

export default Dashboard;
