
import React from 'react';
import { Mail, Apple, Smartphone, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { Subscription } from '../types';

interface SyncResultItemProps {
  item: Subscription;
  onApprove: (id: string) => void;
  onIgnore: (id: string) => void;
}

const SyncResultItem: React.FC<SyncResultItemProps> = ({ item, onApprove, onIgnore }) => (
  <div className="glass p-10 rounded-[4rem] border-white/10 shadow-xl flex flex-col justify-between group relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl">
    <div className="absolute top-0 right-0 p-10 text-indigo-600/5 group-hover:text-indigo-600/10 transition-colors">
      <Sparkles className="w-24 h-24" />
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl text-white ${
            item.source === 'Email' ? 'bg-blue-500' : 
            item.source === 'App Store' ? 'bg-slate-900' : 'bg-indigo-600'
          }`}>
            {item.source === 'Email' ? <Mail className="w-3.5 h-3.5" /> : 
             item.source === 'App Store' ? <Apple className="w-3.5 h-3.5" /> : 
             <Smartphone className="w-3.5 h-3.5" />}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {item.source} Detect
          </span>
        </div>
        {/* Mobile Friendly: trash icon visible by default, removed opacity-0 */}
        <button 
          onClick={() => onIgnore(item.id)} 
          className="p-2 text-slate-300 hover:text-rose-500 transition-colors bg-white/50 dark:bg-white/10 rounded-xl shadow-sm"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 leading-none">
        {item.name}
      </h4>
      <div className="flex items-center gap-4">
        <span className="text-xl font-black text-indigo-600 tracking-tight">
          ${item.amount} 
          <span className="text-[10px] text-slate-400 ml-1 font-bold uppercase tracking-widest">
            / {item.cycle}
          </span>
        </span>
        <span className="text-[9px] font-black text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-white/5">
          {item.category}
        </span>
      </div>
    </div>
    
    <div className="flex flex-col gap-3 mt-12 relative z-10">
      <button 
        onClick={() => onApprove(item.id)} 
        className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        Confirm Tracker <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default SyncResultItem;
