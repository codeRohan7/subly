
import React, { useState } from 'react';
import { 
  FileText, Plus, ShieldCheck, Clock, X, Lock, Key, 
  CheckCircle2, Fingerprint, Trash2, ShieldAlert, Car, Globe, Heart, Calendar,
  Database, RefreshCw, ChevronRight, Eye, Scan, AlertTriangle, Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp, PLAN_LIMITS } from '../AppContext';
import { apiService } from '../apiService';
import { DocumentRecord, DocumentType } from '../types';
import VaultScanner from '../components/VaultScanner';

const OFFICIAL_DOC_TYPES: DocumentType[] = [
  'Driving License', 
  'Pollution Certificate', 
  'Insurance', 
  'Passport', 
  'Vehicle Registration', 
  'Other'
];

const getDocIcon = (type: DocumentType) => {
  switch (type) {
    case 'Driving License': return <ShieldCheck className="w-6 h-6" />;
    case 'Passport': return <Globe className="w-6 h-6" />;
    case 'Insurance': return <Heart className="w-6 h-6" />;
    case 'Vehicle Registration': return <Car className="w-6 h-6" />;
    case 'Pollution Certificate': return <ShieldAlert className="w-6 h-6" />;
    default: return <FileText className="w-6 h-6" />;
  }
};

const Vault: React.FC = () => {
  const { documents, addDocument, removeDocument, user, setVaultKey, isPremium } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(user.vaultKeySet ? 'main' : 'setup');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isDigiSyncing, setIsDigiSyncing] = useState(false);
  const [limitError, setLimitError] = useState(false);
  
  const [manualName, setManualName] = useState('');
  const [manualType, setManualType] = useState<DocumentType>('Other');
  const [manualExpiry, setManualExpiry] = useState('');

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualExpiry) return;
    
    const newDoc: DocumentRecord = {
      id: Date.now().toString(),
      type: manualType,
      name: manualName,
      expiryDate: manualExpiry,
      status: 'Safe',
      remindersEnabled: true
    };

    const result = await addDocument(newDoc);
    if (!result.success) {
      setLimitError(true);
    } else {
      setIsManualModalOpen(false);
      setManualName('');
      setManualExpiry('');
    }
  };

  const handleDigiLockerSync = async () => {
    if (!isPremium) {
      navigate('/upgrade');
      return;
    }
    setIsDigiSyncing(true);
    try {
      const syncedDocs = await apiService.syncDigiLocker();
      for (const d of syncedDocs) {
        if (!documents.some(existing => existing.type === d.type && existing.name === d.name)) {
          await addDocument(d);
        }
      }
    } catch (err) {
      console.error('DigiLocker API Error:', err);
    } finally {
      setIsDigiSyncing(false);
    }
  };

  const openScanner = () => {
    if (!isPremium) {
      navigate('/upgrade');
      return;
    }
    setIsScannerOpen(true);
  };

  const getDaysRemaining = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  if (step === 'setup') {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-12 animate-in zoom-in-95">
        <div className="w-32 h-32 bg-indigo-600 rounded-[3rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-300 ring-8 ring-indigo-600/10">
          <Fingerprint className="w-16 h-16" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">E2EE Digital Vault</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Initialize your Zero-Knowledge keys to secure official documents.</p>
        </div>
        <button onClick={() => { setVaultKey(); setStep('main'); }} className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 transition-all">Initialize Security Node</button>
      </div>
    );
  }

  const usagePercent = (documents.length / PLAN_LIMITS.FREE_DOCUMENTS) * 100;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Security Vault</h1>
          <div className="flex items-center gap-2 mt-4 text-emerald-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Temporal Encryption Active</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleDigiLockerSync} 
            disabled={isDigiSyncing}
            className={`px-6 py-5 glass rounded-[2rem] font-black shadow-lg text-xs uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all ${isPremium ? 'text-orange-500' : 'text-slate-400 opacity-70'}`}
          >
            <Database className={`w-4 h-4 ${isDigiSyncing ? 'animate-spin' : ''}`} /> 
            {isDigiSyncing ? 'Syncing...' : 'DigiLocker'}
            {!isPremium && <Lock className="w-3 h-3" />}
          </button>
          <button 
            onClick={openScanner} 
            className={`px-6 py-5 glass rounded-[2rem] font-black shadow-lg text-xs uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all ${isPremium ? 'text-indigo-600' : 'text-slate-400 opacity-70'}`}
          >
            <Scan className="w-4 h-4" /> AI Scanner
            {!isPremium && <Lock className="w-3 h-3" />}
          </button>
          <button 
            onClick={() => { resetManual(); setIsManualModalOpen(true); }} 
            className="bg-indigo-600 text-white px-8 py-5 rounded-[2rem] font-black shadow-2xl text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center gap-3"
          >
            <Plus className="w-5 h-5" strokeWidth={3} /> Manual
          </button>
        </div>
      </div>

      {/* Plan Capacity Banner */}
      {!isPremium && (
        <div className="glass p-8 rounded-[3rem] border-white/10 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-6 flex-1 w-full">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
               <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Manual Asset Storage</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{documents.length} / {PLAN_LIMITS.FREE_DOCUMENTS} Assets Safe</p>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${usagePercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/upgrade')}
            className="px-8 py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-md flex items-center gap-2"
          >
            <Crown className="w-4 h-4" /> Unlock Sync Vault
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {documents.map(doc => {
          const daysLeft = getDaysRemaining(doc.expiryDate);
          const isExpiring = daysLeft <= 30;
          const isExpired = daysLeft <= 0;
          
          return (
            <div key={doc.id} className={`glass p-10 rounded-[4rem] border-white/10 shadow-lg group relative overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-500 ${isExpired ? 'ring-2 ring-rose-500/30' : ''}`}>
              <div className="flex justify-between items-start mb-10">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform ${isExpired ? 'bg-rose-500/10 text-rose-500' : isExpiring ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-600/10 text-indigo-600'}`}>
                  {getDocIcon(doc.type)}
                </div>
                <button onClick={() => removeDocument(doc.id)} className="p-3 glass rounded-xl text-slate-300 hover:text-rose-500 transition-colors bg-white dark:bg-slate-800 shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight mb-2 truncate">{doc.name}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-[11px] uppercase font-black tracking-[0.3em]">{doc.type}</p>
              </div>
              
              <div className="mt-auto pt-8 border-t border-slate-50 dark:border-white/5">
                <div className="flex justify-between items-center mb-5">
                   <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-bold tabular-nums">{doc.expiryDate}</span>
                   </div>
                   <div className={`text-[10px] font-black uppercase tracking-widest ${isExpired ? 'text-rose-500' : isExpiring ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {isExpired ? 'Expired' : `${daysLeft} Days Left`}
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                   <div 
                     className={`h-full rounded-full transition-all duration-1000 ${isExpired ? 'bg-rose-500' : isExpiring ? 'bg-amber-500' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}
                     style={{ width: `${Math.max(0, Math.min(100, (daysLeft / 365) * 100))}%` }}
                   ></div>
                </div>
              </div>
            </div>
          );
        })}
        
        <button onClick={openScanner} className="border-2 border-dashed border-white/10 rounded-[4rem] flex flex-col items-center justify-center p-16 text-slate-400 hover:text-indigo-600 hover:border-indigo-400 transition-all cursor-pointer bg-white/50 dark:bg-white/5 group relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner ring-1 ring-white/10">
            {isPremium ? <Scan className="w-10 h-10" strokeWidth={3} /> : <Lock className="w-10 h-10" />}
          </div>
          <span className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-2">
            {isPremium ? 'AI Rapid Scan' : 'AI Scan Locked'}
          </span>
        </button>
      </div>

      {isManualModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsManualModalOpen(false)}></div>
          <div className="glass bg-white dark:bg-slate-900 w-full max-w-lg rounded-[4rem] p-12 relative z-10 shadow-2xl border-white/10 animate-in zoom-in-95">
            
            {limitError ? (
              <div className="text-center space-y-8 py-10">
                <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto">
                   <AlertTriangle className="w-10 h-10" />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">Vault Limit Reached</h2>
                   <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                     Free tier vault is restricted to <strong>{PLAN_LIMITS.FREE_DOCUMENTS} asset nodes</strong>. Upgrade for infinite secure storage.
                   </p>
                </div>
                <button onClick={() => navigate('/upgrade')} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-3">
                   <Crown className="w-5 h-5" /> Go Premium
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-10">New Asset Record</h3>
                <form onSubmit={handleManualSubmit} className="space-y-8">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-2">Description</label>
                    <input autoFocus type="text" required value={manualName} onChange={(e) => setManualName(e.target.value)} className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none text-slate-900 dark:text-white focus:ring-4 focus:ring-indigo-600/10 transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-2">Class</label>
                      <select value={manualType} onChange={(e) => setManualType(e.target.value as any)} className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none text-slate-900 dark:text-white appearance-none cursor-pointer">
                        {OFFICIAL_DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-2">Expiry</label>
                      <input type="date" required value={manualExpiry} onChange={(e) => setManualExpiry(e.target.value)} className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none text-slate-900 dark:text-white cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 pt-8">
                     <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black shadow-2xl uppercase tracking-[0.2em] text-xs">Commit to Vault</button>
                     <button type="button" onClick={() => setIsManualModalOpen(false)} className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-[10px]">Cancel</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {isScannerOpen && <VaultScanner onClose={() => setIsScannerOpen(false)} />}
    </div>
  );

  function resetManual() {
    setManualName('');
    setManualExpiry('');
    setManualType('Other');
    setLimitError(false);
  }
};

export default Vault;
