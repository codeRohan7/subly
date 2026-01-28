
import React from 'react';
import { 
  Bell, AlertTriangle, TrendingUp, Calendar, 
  RefreshCw, Mail, X, ArrowRight, Zap, Info
} from 'lucide-react';
import { SmartAlert } from '../types';

interface SmartAlertItemProps {
  alert: SmartAlert;
  onDismiss?: (id: string) => void;
  onAction?: (alert: SmartAlert) => void;
}

const SmartAlertItem: React.FC<SmartAlertItemProps> = ({ alert, onDismiss, onAction }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'bill': return <Calendar className="w-5 h-5" />;
      case 'price': return <TrendingUp className="w-5 h-5" />;
      case 'vault': return <Zap className="w-5 h-5" />;
      case 'sync': return <RefreshCw className="w-5 h-5" />;
      case 'invite': return <Mail className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const severityStyles = {
    critical: 'border-l-rose-500 bg-rose-500/5 ring-rose-500/10 text-rose-600',
    warning: 'border-l-amber-500 bg-amber-500/5 ring-amber-500/10 text-amber-600',
    info: 'border-l-indigo-500 bg-indigo-500/5 ring-indigo-500/10 text-indigo-600'
  };

  return (
    <div className={`glass p-6 rounded-[2.25rem] border-l-4 shadow-xl flex gap-5 animate-in slide-in-from-right duration-500 group relative transition-all hover:scale-[1.01] ${severityStyles[alert.severity]}`}>
      <div className={`p-3.5 rounded-2xl flex-shrink-0 bg-white dark:bg-slate-900 shadow-sm border border-black/5 dark:border-white/5`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 pr-8">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-[11px] font-black uppercase tracking-tight leading-none">
            {alert.title}
          </h4>
          <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest tabular-nums">
            {new Date(alert.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest leading-tight">
          {alert.description}
        </p>
        
        {onAction && (
          <button 
            onClick={() => onAction(alert)}
            className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest hover:gap-4 transition-all"
          >
            Resolution Node <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {onDismiss && (
        <button 
          onClick={() => onDismiss(alert.id)}
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SmartAlertItem;
