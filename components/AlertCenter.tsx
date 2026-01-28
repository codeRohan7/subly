
import React, { useState } from 'react';
import { Bell, Trash2, SlidersHorizontal, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../AppContext';
import SmartAlertItem from './SmartAlertItem';

const AlertCenter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { alerts, purgeAllData } = useApp(); // In a real app, we'd have a specific removeAlert function
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning'>('all');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-end">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="glass bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l border-white/10 animate-in slide-in-from-right duration-500 flex flex-col">
        <header className="p-10 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Intelligence</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{alerts.length} active notifications</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
          <div className="flex gap-2 pb-4">
            {['all', 'critical', 'warning'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'glass text-slate-400 hover:text-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="py-20 text-center space-y-4 opacity-40">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
              <p className="text-[10px] font-black uppercase tracking-widest">Cognitive load optimal</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <SmartAlertItem 
                key={alert.id} 
                alert={alert} 
                onDismiss={(id) => console.log('Dismiss', id)}
                onAction={(a) => console.log('Action on', a)}
              />
            ))
          )}
        </div>

        <footer className="p-8 border-t border-white/5 bg-slate-50 dark:bg-white/5">
          <button className="w-full py-5 glass text-slate-400 hover:text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
            <Trash2 className="w-4 h-4" /> Purge History Buffer
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AlertCenter;
