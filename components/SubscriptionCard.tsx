
import React from 'react';
import { Edit3, Trash2, Pause, Play, Calendar, Mail, Apple, Smartphone, AlertTriangle, TrendingUp } from 'lucide-react';
import { Subscription, SubscriptionStatus } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface SubscriptionCardProps {
  sub: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (sub: Subscription) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ sub, onEdit, onDelete, onToggleStatus }) => {
  const isPaused = sub.status === SubscriptionStatus.PAUSED;
  const isPriceIncreased = sub.previousAmount && sub.amount > sub.previousAmount;

  const getStatusConfig = () => {
    switch (sub.status) {
      case SubscriptionStatus.ACTIVE: 
        return { color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case SubscriptionStatus.PAUSED: 
        return { color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case SubscriptionStatus.CANCELLED: 
        return { color: 'text-slate-400', bg: 'bg-slate-400/10' };
      case SubscriptionStatus.EXPIRED: 
        return { color: 'text-rose-500', bg: 'bg-rose-500/10' };
      default: 
        return { color: 'text-slate-400', bg: 'bg-slate-400/10' };
    }
  };

  const status = getStatusConfig();

  return (
    <div className={`glass p-7 rounded-[3rem] border-white/10 shadow-xl relative flex flex-col h-full transition-all duration-500 ${isPaused ? 'opacity-80' : 'hover:shadow-2xl hover:-translate-y-1'}`}>
      
      {/* Price Hike Badge */}
      {isPriceIncreased && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-rose-500 text-white rounded-full flex items-center gap-2 z-20 shadow-xl animate-bounce">
           <TrendingUp className="w-3.5 h-3.5" />
           <span className="text-[9px] font-black uppercase tracking-widest">Price Increase</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1 glass rounded-full border-white/10 text-[8px] font-black uppercase tracking-widest text-slate-400">
          {sub.source === 'Email' ? <Mail className="w-3 h-3" /> : sub.source === 'App Store' ? <Apple className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
          {sub.source}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onToggleStatus(sub)} className="p-2.5 glass rounded-xl text-slate-400 hover:text-amber-500 transition-all">
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          </button>
          <button onClick={() => onEdit(sub)} className="p-2.5 glass rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Identity */}
      <div className="flex items-center gap-5 mb-8">
        <div className="relative shrink-0">
          <img src={sub.icon} className="w-16 h-16 rounded-[1.75rem] shadow-lg border border-white/20 object-cover" alt={sub.name} />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 glass rounded-full flex items-center justify-center text-indigo-600 shadow-xl border-white/20">
            {CATEGORY_ICONS[sub.category]}
          </div>
        </div>
        <div>
          <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{sub.name}</h4>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${status.bg} ${status.color}`}>
            {sub.status}
          </span>
        </div>
      </div>

      {/* Reminder Setting Info */}
      <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-indigo-500/5 rounded-2xl border border-indigo-500/5">
         <AlertTriangle className="w-3 h-3 text-indigo-400" />
         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Alert: {sub.reminderDays} Days Lead</span>
      </div>

      {/* Financials */}
      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-end justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{sub.cycle}</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">${sub.amount.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <div className="bg-indigo-600/5 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-white/5 flex items-center gap-2">
            <Calendar className="w-3 h-3 text-indigo-500" />
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{sub.nextBillingDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
