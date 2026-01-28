
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SyncSourceCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  color: string;
  platform?: 'iOS' | 'Android' | 'Cloud';
}

const SyncSourceCard: React.FC<SyncSourceCardProps> = ({ icon, title, desc, onClick, color, platform }) => (
  <button 
    onClick={onClick} 
    className="glass p-10 rounded-[3.5rem] text-left hover:shadow-2xl transition-all group flex flex-col h-full active:scale-95 border-white/10 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/[0.02] transition-colors"></div>
    {platform && (
      <div className="absolute top-6 right-8 text-[8px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-full">
        {platform} Optimized
      </div>
    )}
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-3xl font-black mb-3 tracking-tighter text-slate-900 dark:text-white leading-none">
      {title}
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-10 font-medium leading-relaxed flex-1">
      {desc}
    </p>
    <div className="text-indigo-600 font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-1 group-hover:gap-3 transition-all">
      Establish Channel <ChevronRight className="w-4 h-4" strokeWidth={3} />
    </div>
  </button>
);

export default SyncSourceCard;
