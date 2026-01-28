
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, TrendingDown, RefreshCw } from 'lucide-react';
import { useApp } from '../AppContext';
import { getPlanOptimization } from '../geminiService';
import { PlanAlternative } from '../types';

const SubscriptionOptimizer: React.FC = () => {
  const { subscriptions } = useApp();
  const [optimizations, setOptimizations] = useState<PlanAlternative[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOptimizations = async () => {
    if (subscriptions.length === 0) return;
    setLoading(true);
    const res = await getPlanOptimization(subscriptions);
    setOptimizations(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchOptimizations();
  }, [subscriptions.length]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between p-8 glass rounded-[3rem] bg-indigo-600 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12"><TrendingDown className="w-48 h-48" /></div>
        <div className="relative z-10 flex items-center gap-6">
           <div className="w-20 h-20 bg-white/20 rounded-[2.5rem] flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl">
              <Sparkles className="w-10 h-10 fill-white" />
           </div>
           <div>
             <h2 className="text-3xl font-black tracking-tighter leading-none mb-3">AI Plan Optimizer</h2>
             <p className="text-sm font-medium opacity-80 max-w-md">Our neural engine analyzes global plan data to find your optimal billing configuration.</p>
           </div>
        </div>
        <button 
          onClick={fetchOptimizations} 
          disabled={loading}
          className="relative z-10 p-5 glass rounded-[2rem] bg-white/10 hover:bg-white/20 transition-all"
        >
          <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? [1,2].map(i => <div key={i} className="h-64 glass rounded-[3.5rem] animate-pulse"></div>) :
         optimizations.map((opt, i) => (
           <div key={i} className="glass p-10 rounded-[3.5rem] border-white/10 shadow-xl group hover:shadow-2xl transition-all">
             <div className="flex justify-between items-start mb-8">
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-full">Save ${opt.savings} Yearly</span>
               <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{opt.serviceName}</h3>
             <div className="flex items-center gap-4 mb-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 line-through">{opt.currentPlan}</div>
                <div className="w-2 h-px bg-slate-200 dark:bg-white/10"></div>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{opt.suggestedPlan}</div>
             </div>
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">"{opt.reason}"</p>
             <button className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Apply Recommendation</button>
           </div>
         ))
        }
      </div>
    </div>
  );
};

export default SubscriptionOptimizer;
