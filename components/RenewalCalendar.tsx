
import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Subscription } from '../types';

interface RenewalCalendarProps {
  subscriptions: Subscription[];
}

const RenewalCalendar: React.FC<RenewalCalendarProps> = ({ subscriptions }) => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentMonthName = today.toLocaleString('default', { month: 'long' });

  const getSubscriptionsForDay = (day: number) => {
    return subscriptions.filter(sub => {
      const billingDate = new Date(sub.nextBillingDate);
      return billingDate.getDate() === day && billingDate.getMonth() === today.getMonth();
    });
  };

  return (
    <div className="glass p-8 rounded-[3.5rem] border-white/10 shadow-xl overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{currentMonthName}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Renewal Timeline</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 glass rounded-xl text-slate-400 hover:text-indigo-600 transition-all"><ChevronLeft className="w-4 h-4" /></button>
          <button className="p-2 glass rounded-xl text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const daySubs = getSubscriptionsForDay(day);
          const isToday = day === today.getDate();
          const hasSubs = daySubs.length > 0;

          return (
            <div 
              key={day} 
              className={`flex-shrink-0 w-20 flex flex-col items-center gap-3 p-4 rounded-[2rem] snap-center transition-all duration-300 ${
                isToday ? 'bg-indigo-600 text-white shadow-2xl scale-110 z-10' : 
                hasSubs ? 'glass border-indigo-500/20' : 'opacity-40'
              }`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                {new Date(today.getFullYear(), today.getMonth(), day).toLocaleString('default', { weekday: 'short' })}
              </span>
              <span className="text-2xl font-black tracking-tighter">{day}</span>
              {hasSubs && (
                <div className="flex flex-col gap-1 mt-2">
                  {daySubs.map(sub => (
                    <div key={sub.id} className={`w-2 h-2 rounded-full ${isToday ? 'bg-white' : 'bg-indigo-600 animate-pulse'}`}></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasSubscriptionsToday() && (
        <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-lg"><CalendarIcon className="w-5 h-5" /></div>
             <div>
               <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Action Required</p>
               <p className="text-sm font-bold text-slate-900 dark:text-slate-200 tracking-tight">You have renewals leaving today.</p>
             </div>
          </div>
          <button className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">View Details</button>
        </div>
      )}
    </div>
  );

  function hasSubscriptionsToday() {
    return getSubscriptionsForDay(today.getDate()).length > 0;
  }
};

export default RenewalCalendar;
