
import React, { useState } from 'react';
import { 
  Mail, Smartphone, BrainCircuit, CheckCircle2, X, Shield, 
  Apple, Sparkles, RefreshCw, Search, Lock, Info, Check, AlertTriangle, Crown, EyeOff, ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { BillingCycle, SubscriptionStatus, Category, Subscription } from '../types';
import { analyzeDeviceApps } from '../geminiService';
import SyncSourceCard from '../components/SyncSourceCard';
import SyncResultItem from '../components/SyncResultItem';

const SyncAccounts: React.FC = () => {
  const { subscriptions, approveSyncItem, ignoreSyncItem, setPendingSync, pendingSync, isPremium } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<'options' | 'consent' | 'scanning' | 'results'>('options');
  const [syncType, setSyncType] = useState<'Email' | 'App Store' | 'Device Scan'>('Email');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSyncInitiation = (type: 'Email' | 'App Store' | 'Device Scan') => {
    if (!isPremium) {
      navigate('/upgrade');
      return;
    }
    setSyncType(type);
    setStep('consent');
  };

  const startSyncProcess = async () => {
    setStep('scanning');
    setIsProcessing(true);
    
    try {
      let mockResults: Subscription[] = [];
      const timestamp = Date.now();

      if (syncType === 'Email') {
        mockResults = [
          { id: `e-${timestamp}-1`, name: 'Netflix Premium', amount: 19.99, currency: 'USD', cycle: BillingCycle.MONTHLY, category: Category.ENTERTAINMENT, status: SubscriptionStatus.ACTIVE, nextBillingDate: '2024-06-15', reminderDays: 3, source: 'Email' },
          { id: `e-${timestamp}-2`, name: 'Microsoft 365', amount: 99.99, currency: 'USD', cycle: BillingCycle.YEARLY, category: Category.WORK, status: SubscriptionStatus.ACTIVE, nextBillingDate: '2025-01-10', reminderDays: 7, source: 'Email' },
          { id: `e-${timestamp}-3`, name: 'Spotify Duo', amount: 14.99, currency: 'USD', cycle: BillingCycle.MONTHLY, category: Category.ENTERTAINMENT, status: SubscriptionStatus.ACTIVE, nextBillingDate: '2024-06-20', reminderDays: 3, source: 'Email' }
        ];
      } else if (syncType === 'App Store') {
        mockResults = [
          { id: `a-${timestamp}-1`, name: 'Duolingo Plus', amount: 12.99, currency: 'USD', cycle: BillingCycle.MONTHLY, category: Category.OTHER, status: SubscriptionStatus.ACTIVE, nextBillingDate: '2024-06-02', reminderDays: 3, source: 'App Store' },
          { id: `a-${timestamp}-2`, name: 'Headspace', amount: 69.99, currency: 'USD', cycle: BillingCycle.YEARLY, category: Category.HEALTH, status: SubscriptionStatus.ACTIVE, nextBillingDate: '2025-05-22', reminderDays: 5, source: 'App Store' }
        ];
      } else if (syncType === 'Device Scan') {
        const appList = ['Netflix', 'Spotify', 'Amazon Prime', 'Slack', 'Canva', 'Discord'];
        const aiPredictions = await analyzeDeviceApps(appList);
        
        mockResults = aiPredictions.map((p: any, idx: number) => ({
          id: `d-${timestamp}-${idx}`,
          name: p.name,
          amount: p.amount || 9.99,
          currency: 'USD',
          cycle: (p.cycle as BillingCycle) || BillingCycle.MONTHLY,
          category: (p.category as Category) || Category.OTHER,
          status: SubscriptionStatus.ACTIVE,
          nextBillingDate: p.nextBillingDate || new Date().toISOString().split('T')[0],
          reminderDays: 3,
          source: 'Device Scan'
        }));
      }

      const uniqueFound = mockResults.filter(found => 
        !subscriptions.some(existing => existing.name.toLowerCase() === found.name.toLowerCase())
      );

      setPendingSync(uniqueFound);
      setStep('results');
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const approveAll = async () => {
    for (const item of pendingSync) {
      await approveSyncItem(item.id);
    }
    setStep('options');
  };

  if (!isPremium && step === 'options') {
    return (
      <div className="max-w-4xl mx-auto py-20 animate-in fade-in duration-700">
        <div className="glass p-16 rounded-[5rem] border-white/10 text-center space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12 scale-150"><BrainCircuit className="w-96 h-96" /></div>
          
          <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl animate-float">
            <Crown className="w-12 h-12" />
          </div>
          
          <div className="space-y-4">
             <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Premium Neural Sync</h2>
             <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto text-lg leading-relaxed">
               Upgrade to enable **Neural Platform Sync**. Automatically audit Gmail, Apple ID, and Device Notifications to track every billing node without manual input.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
             {[
               { icon: <Mail />, label: "Email Audit" },
               { icon: <Apple />, label: "Store Link" },
               { icon: <RefreshCw />, label: "Auto-Refresh" }
             ].map((feature, i) => (
               <div key={i} className="glass p-8 rounded-[2.5rem] flex flex-col items-center gap-4 border-white/5 bg-white/30">
                  <div className="text-indigo-600">{feature.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{feature.label}</span>
               </div>
             ))}
          </div>

          <button 
            onClick={() => navigate('/upgrade')}
            className="w-full max-w-md py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Go Premium to Sync
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in pb-20 duration-500">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-6 py-2 glass rounded-full border-indigo-500/10 shadow-lg mb-4">
           <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin opacity-50" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Nebula Intelligence Layer</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Sync Intelligence Hub</h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto text-lg leading-relaxed">
          Connect your digital ecosystems. Subly audits your footprint using encrypted on-device AI to track every active billing node.
        </p>
      </div>

      {step === 'options' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <SyncSourceCard 
            icon={<Mail className="w-8 h-8" />} 
            title="Android & Google Play" 
            desc="AI audits your primary Gmail inbox and Android Play Store history for receipts and invoices." 
            onClick={() => handleSyncInitiation('Email')} 
            color="bg-blue-500/10 text-blue-500"
            platform="Android"
          />
          <SyncSourceCard 
            icon={<Apple className="w-8 h-8" />} 
            title="iOS & App Store" 
            desc="Sync your Apple ID directly to fetch active iCloud, App Store, and Apple One subscriptions." 
            onClick={() => handleSyncInitiation('App Store')} 
            color="bg-slate-950 text-white"
            platform="iOS"
          />
          <SyncSourceCard 
            icon={<Smartphone className="w-8 h-8" />} 
            title="Smart Device Audit" 
            desc="Analyzes installed app footprints and notification headers to suggest active paid services." 
            onClick={() => handleSyncInitiation('Device Scan')} 
            color="bg-indigo-600/10 text-indigo-600" 
          />
          <div 
            onClick={() => !isPremium ? navigate('/upgrade') : null}
            className="glass p-12 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-6 border-dashed border-2 cursor-pointer transition-all group overflow-hidden relative"
          >
             {!isPremium && <div className="absolute top-4 right-6 p-2 bg-amber-50 text-white rounded-full"><Crown className="w-4 h-4" /></div>}
             <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600/10 group-hover:text-indigo-600 transition-all">
                <Lock className="w-8 h-8" />
             </div>
             <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">External Bank Sync</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">Node Protocol Premium</p>
             </div>
          </div>
        </div>
      )}

      {step === 'consent' && (
        <div className="glass p-16 md:p-20 rounded-[5rem] space-y-12 animate-in zoom-in-95 max-w-3xl mx-auto border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 text-indigo-600/5 rotate-12 scale-150">
             <Shield className="w-64 h-64" />
          </div>
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 dark:shadow-none animate-float">
              <Shield className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Authorization</h2>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400">Sandbox Encryption Protocol</p>
            </div>
          </div>
          
          <div className="space-y-8 text-slate-600 dark:text-slate-400 font-medium leading-relaxed relative z-10">
            <p className="text-2xl text-slate-700 dark:text-slate-200 tracking-tight">
              Grant Subly read-only authorization to audit your <strong>{syncType}</strong> metadata.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex gap-5 group">
                <div className="p-4 glass rounded-2xl text-indigo-600 h-fit shadow-inner group-hover:scale-110 transition-transform"><Lock className="w-5 h-5" /></div>
                <div><h4 className="font-black text-base text-slate-900 dark:text-white tracking-tight">Secure Token</h4><p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">OAuth2 Encrypted Layer</p></div>
              </div>
              <div className="flex gap-5 group">
                <div className="p-4 glass rounded-2xl text-indigo-600 h-fit shadow-inner group-hover:scale-110 transition-transform"><EyeOff className="w-5 h-5" /></div>
                <div><h4 className="font-black text-base text-slate-900 dark:text-white tracking-tight">Metadata Privacy</h4><p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">No Private Message Access</p></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 pt-12 border-t border-slate-100 dark:border-white/5 relative z-10">
            <button onClick={startSyncProcess} className="flex-[2] py-7 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-indigo-200 dark:shadow-none">Initialize Synchronization</button>
            <button onClick={() => setStep('options')} className="flex-1 py-7 glass text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] hover:text-slate-600 hover:bg-white/10 transition-all rounded-[2.5rem]">Abort</button>
          </div>
        </div>
      )}

      {step === 'scanning' && (
        <div className="glass p-32 rounded-[6rem] text-center space-y-16 shadow-2xl max-w-3xl mx-auto border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 nebula-bg opacity-40 -z-10"></div>
          <div className="relative w-48 h-48 mx-auto">
             <RefreshCw className="w-full h-full text-indigo-600 animate-spin opacity-5" strokeWidth={1} />
             <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="w-24 h-24 text-indigo-600 animate-pulse" />
             </div>
             <div className="absolute -bottom-4 -right-4 bg-indigo-600 p-5 rounded-full shadow-2xl text-white">
                <RefreshCw className="w-8 h-8 animate-spin" />
             </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Neural Platform Scan...</h2>
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Locating recurring billing headers in your {syncType} footprint</p>
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-12 duration-700">
           <header className="flex flex-col md:flex-row justify-between items-center px-4 gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Inventory Matches</h2>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                   <div className="px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-200 dark:shadow-none">Found {pendingSync.length} Detections</div>
                   <div className="px-4 py-1.5 glass text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border-white/10">Source: {syncType} Hub</div>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                 <button onClick={approveAll} className="flex-1 md:flex-none px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-5 h-5" /> Commit All Matches
                 </button>
                 <button onClick={() => navigate('/subscriptions')} className="flex-1 md:flex-none px-10 py-5 glass text-slate-500 rounded-[2rem] font-black uppercase text-[11px] tracking-widest hover:bg-white/10 transition-all border-white/10">Done Reviewing</button>
              </div>
           </header>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {pendingSync.length === 0 ? (
               <div className="md:col-span-3 glass p-32 rounded-[5rem] text-center border-dashed border-2 flex flex-col items-center justify-center gap-10 relative overflow-hidden group">
                  <div className="absolute inset-0 nebula-bg opacity-30 -z-10 group-hover:opacity-50 transition-opacity"></div>
                  <div className="w-28 h-28 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-inner ring-1 ring-emerald-500/20">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Sync Cycle Optimized</h3>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">All digital footprint nodes are currently accounted for.</p>
                  </div>
                  <button onClick={() => setStep('options')} className="mt-4 px-10 py-5 glass text-slate-500 font-black uppercase text-[11px] tracking-widest hover:bg-indigo-600 hover:text-white hover:shadow-2xl transition-all rounded-[2rem] border-white/10">Back to Node Hub</button>
               </div>
             ) : pendingSync.map((item) => (
               <SyncResultItem 
                 key={item.id} 
                 item={item} 
                 onApprove={async (id) => {
                    const res = await approveSyncItem(id);
                    if (!res.success && res.error === 'FREE_LIMIT_REACHED') {
                      navigate('/upgrade');
                    }
                 }} 
                 onIgnore={ignoreSyncItem} 
               />
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default SyncAccounts;
