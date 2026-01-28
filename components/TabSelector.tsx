
import React from 'react';

interface TabSelectorProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'primary' | 'ghost';
}

const TabSelector: React.FC<TabSelectorProps> = ({ tabs, activeTab, onChange, variant = 'primary' }) => {
  return (
    <div className={`flex p-1.5 ${variant === 'primary' ? 'glass' : 'bg-transparent'} rounded-2xl shadow-xl w-fit`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3
              ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}
            `}
          >
            {isActive && (
              <div className="absolute inset-0 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 animate-in fade-in zoom-in-95 duration-300 -z-10" />
            )}
            {tab.icon && <span className={`transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabSelector;
