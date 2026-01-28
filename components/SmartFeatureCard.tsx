
import React from 'react';
import { Sparkles, ArrowRight, LucideIcon } from 'lucide-react';

interface SmartFeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionText?: string;
  onClick?: () => void;
  variant?: 'indigo' | 'amber' | 'emerald' | 'rose';
}

const SmartFeatureCard: React.FC<SmartFeatureCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  actionText = "Explore Node", 
  onClick,
  variant = 'indigo'
}) => {
  const colors = {
    indigo: 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none',
    amber: 'bg-amber-500 text-white shadow-amber-200 dark:shadow-none',
    emerald: 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none',
    rose: 'bg-rose-500 text-white shadow-rose-200 dark:shadow-none',
  };

  return (
    <div 
      onClick={onClick}
      className={`${colors[variant]} p-10 rounded-[3.5rem] relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all hover:shadow-2xl`}
    >
      <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
        <Icon className="w-48 h-48" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xl border border-white/20">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Subly Intelligence Enhancement</span>
        </div>

        <h3 className="text-3xl font-black tracking-tighter leading-none mb-4">{title}</h3>
        <p className="text-sm font-medium opacity-80 mb-10 max-w-[85%]">{description}</p>
        
        <div className="mt-auto flex items-center gap-2 text-[11px] font-black uppercase tracking-widest bg-white/10 w-fit px-6 py-3 rounded-full backdrop-blur-md border border-white/5 hover:bg-white/20 transition-all">
          {actionText} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default SmartFeatureCard;
