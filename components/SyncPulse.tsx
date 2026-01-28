
import React from 'react';

const SyncPulse: React.FC = () => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 glass rounded-full border-white/10">
      <div className="relative w-2 h-2">
        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
        <div className="absolute inset-0 bg-emerald-500 rounded-full"></div>
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
        AI Nodes Active
      </span>
    </div>
  );
};

export default SyncPulse;
