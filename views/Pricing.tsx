
import React, { useState } from 'react';
import { Check, Crown, Star, ReceiptText, Sparkles, X, Shield, Fingerprint, Apple, Lock, ShieldCheck } from 'lucide-react';
import { useApp } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const { upgradeToPremium, isPremium, user } = useApp();
  const navigate = useNavigate();
  const [showIAPModal, setShowIAPModal] = useState<null | 'monthly' | 'yearly'>(null);
  const [purchasing, setPurchasing] = useState(false);

  const handleApplePay = () => {
    setPurchasing(true);
    // Simulate FaceID/TouchID delay
    setTimeout(() => {
      upgradeToPremium();
      setPurchasing(false);
      setShowIAPModal(null);
      navigate('/');
    }, 2500);
  };

  const features = [
    { label: 'Smart Auto-Sync (AI)', free: false, premium: true },
    { label: 'Manual Tracking', free: 'Up to 5', premium: 'Unlimited' },
    { label: 'Document Vault', free: 'Up to 3', premium: 'Unlimited' },
    { label: 'Encrypted Cloud Backup', free: false, premium: true },
    { label: 'Advanced Velocity Analytics', free: false, premium: true },
    { label: 'Custom Multi-day Alerts', free: false, premium: true },
  ];

  if (isPremium) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-10 animate-in zoom-in-95 duration-500">
        <div className="w-28 h-28 bg-amber-50 dark:bg-amber-900/20 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-amber-100/30 border border-amber-100 dark:border-amber-900/40">
          <Crown className="w-14 h-14 text-amber-500" />
        </div>
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tight text-slate-900 dark:text-white">Premium Tier</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xl font-medium">Your account is fully optimized with enterprise security.</p>
        </div>
        <button onClick={() => navigate('/')} className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95">Go to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-24 animate-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-amber-100 dark:border-amber-900/40 shadow-sm"><Star className="w-4 h-4 fill-amber-500" /> Unlock Subly Intelligence</div>
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">Elevate Your Finance Flow</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl font-medium leading-relaxed">Stop leaking money to forgotten renewals. Get AI-powered oversight and military-grade document security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 group hover:shadow-2xl transition-all">
          <div className="space-y-2">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Rolling Monthly</p>
            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">₹149<span className="text-base text-slate-400 ml-1 font-medium">/mo</span></h3>
          </div>
          <button onClick={() => setShowIAPModal('monthly')} className="w-full py-5 bg-slate-900 dark:bg-slate-800 text-white rounded-[1.5rem] font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 text-xs uppercase tracking-widest">Select Monthly</button>
        </div>

        <div className="bg-indigo-600 p-12 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform"><Crown className="w-48 h-48" /></div>
          <div className="relative z-10 space-y-8">
            <div className="space-y-2">
              <div className="bg-white/20 w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 backdrop-blur-md">Most Value</div>
              <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em]">Annual Pass</p>
              <h3 className="text-5xl font-black tracking-tighter">₹999<span className="text-base text-indigo-200 ml-1 font-medium">/yr</span></h3>
            </div>
            <p className="text-indigo-100/80 text-sm font-medium">Save 45% compared to monthly bills. Includes priority cloud encryption backup.</p>
            <button onClick={() => setShowIAPModal('yearly')} className="w-full py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black hover:bg-amber-50 transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest">Select Annual</button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
           <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Full Plan Comparison</h3>
           <ShieldCheck className="w-5 h-5 text-emerald-500" />
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50">
            <tr><th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Benefit</th><th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Basic</th><th className="px-10 py-5 text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Premium</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {features.map((f, i) => (
              <tr key={i} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-10 py-6 text-sm font-bold text-slate-700 dark:text-slate-300">{f.label}</td>
                <td className="px-10 py-6 text-sm text-slate-400 font-medium">{typeof f.free === 'string' ? f.free : (f.free ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 opacity-20" />)}</td>
                <td className="px-10 py-6 font-black text-indigo-600 dark:text-indigo-400 text-sm">{typeof f.premium === 'string' ? f.premium : (f.premium ? <Check className="w-5 h-5 text-indigo-600" /> : <X className="w-5 h-5 opacity-20" />)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center gap-8 pt-10">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 dark:border-slate-800 pt-8 w-full max-w-2xl">
           <button className="hover:text-indigo-600 transition-colors">Privacy Policy</button>
           <button className="hover:text-indigo-600 transition-colors">Terms of Use</button>
           <button onClick={() => alert("Checking with Apple ID...")} className="hover:text-indigo-600 transition-colors">Restore Purchases</button>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 px-8 py-4 rounded-[2rem] border border-slate-200 dark:border-slate-700/50">
           <Apple className="w-5 h-5" />
           <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em]">Managed securely by Apple In-App Purchases</p>
        </div>
      </div>

      {/* Apple IAP Confirmation Sheet - Mobile-first simulation */}
      {showIAPModal && (
        <div className="fixed inset-0 z-[1000] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => !purchasing && setShowIAPModal(null)}></div>
          <div className="bg-[#f2f2f7] dark:bg-[#1c1c1e] w-full max-w-md rounded-t-[3rem] md:rounded-[3rem] p-8 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-500 origin-bottom">
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-8 md:hidden"></div>
            
            <div className="flex justify-between items-start mb-10">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white font-black text-3xl shadow-xl">S</div>
                <div>
                  <h4 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Subly Premium</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{showIAPModal === 'monthly' ? 'Auto-Renewal Monthly' : 'Auto-Renewal Yearly'}</p>
                </div>
              </div>
              <Apple className="w-7 h-7 text-slate-400" />
            </div>

            <div className="bg-white dark:bg-[#2c2c2e] rounded-3xl p-6 space-y-5 shadow-sm mb-10 border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-sm"><span className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Apple ID</span><span className="font-bold text-slate-900 dark:text-white">{user.email}</span></div>
              <div className="h-px bg-slate-50 dark:bg-slate-800"></div>
              <div className="flex justify-between items-center text-sm"><span className="text-slate-500 font-bold uppercase tracking-tighter text-[10px]">Price</span><span className="font-black text-lg text-slate-900 dark:text-white">{showIAPModal === 'monthly' ? '₹149.00' : '₹999.00'}</span></div>
            </div>

            <div className="text-center space-y-8">
              <div className="flex flex-col items-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 shadow-inner ${purchasing ? 'animate-pulse' : ''}`}>
                  <Fingerprint className="w-10 h-10" />
                </div>
                <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {purchasing ? 'Encrypting Transaction...' : 'Double Click Side Button to Confirm'}
                </p>
              </div>
              
              <button 
                disabled={purchasing}
                onClick={handleApplePay} 
                className="w-full py-5 bg-slate-950 dark:bg-white dark:text-black text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl disabled:opacity-50 transition-all active:scale-95"
              >
                {purchasing ? <Sparkles className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm with Biometrics'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
