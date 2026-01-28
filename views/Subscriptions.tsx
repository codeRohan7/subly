
import React, { useState } from 'react';
import { 
  Search, Plus, LayoutGrid, RefreshCw, X, Sparkles, CheckCircle2, 
  Settings2, Eye, Info, Clock, CreditCard, TrendingDown, Bell, Crown, AlertTriangle, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp, PLAN_LIMITS } from '../AppContext';
import { BillingCycle, Category, SubscriptionStatus, Subscription } from '../types';
import TabSelector from '../components/TabSelector';
import SyncResultItem from '../components/SyncResultItem';
import SyncPulse from '../components/SyncPulse';
import SubscriptionCard from '../components/SubscriptionCard';
import SubscriptionOptimizer from '../components/SubscriptionOptimizer';
import { calculateNextBillingDate } from '../utils/dateUtils';

const Subscriptions: React.FC = () => {
  const { 
    subscriptions, addSubscription, updateSubscription, 
    removeSubscription, pendingSync, approveSyncItem, ignoreSyncItem,
    user, isPremium
  } = useApp();
  
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<'manage' | 'discover' | 'optimize'>('manage');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limitError, setLimitError] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<Category>(Category.ENTERTAINMENT);
  const [newCycle, setNewCycle] = useState<BillingCycle>(BillingCycle.MONTHLY);
  const [newStatus, setNewStatus] = useState<SubscriptionStatus>(SubscriptionStatus.ACTIVE);
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newReminderDays, setNewReminderDays] = useState(3);
  const [isShared, setIsShared] = useState(false);
  const [activeSource, setActiveSource] = useState<string>('Manual');

  const filteredSubs = subscriptions.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditModal = (sub: Subscription) => {
    setEditingId(sub.id);
    setNewName(sub.name);
    setNewAmount(sub.amount.toString());
    setNewCategory(sub.category);
    setNewCycle(sub.cycle);
    setNewStatus(sub.status);
    setNewStartDate(sub.nextBillingDate);
    setNewReminderDays(sub.reminderDays || 3);
    setIsShared(sub.isShared || false);
    setActiveSource(sub.source);
    setIsModalOpen(true);
    setLimitError(false);
  };

  const handleToggleStatus = async (sub: Subscription) => {
    const nextStatus = sub.status === SubscriptionStatus.PAUSED 
      ? SubscriptionStatus.ACTIVE 
      : SubscriptionStatus.PAUSED;
    await updateSubscription({ ...sub, status: nextStatus });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || (!editingId && !newAmount)) return;

    const existing = subscriptions.find(s => s.id === editingId);
    const amountVal = editingId ? (existing?.amount || 0) : parseFloat(newAmount);
    const nextDate = calculateNextBillingDate(newStartDate, newCycle);

    const subData: Subscription = {
      id: editingId || Date.now().toString(),
      name: newName,
      amount: amountVal,
      previousAmount: existing && amountVal !== existing.amount ? existing.amount : existing?.previousAmount,
      currency: 'USD',
      cycle: newCycle,
      category: newCategory,
      status: newStatus,
      nextBillingDate: nextDate,
      reminderDays: newReminderDays,
      isShared: isShared,
      source: existing?.source || 'Manual' as any,
      icon: existing?.icon || `https://picsum.photos/seed/${newName}/100/100`
    };

    if (editingId) {
      await updateSubscription(subData);
      setIsModalOpen(false);
    } else {
      const result = await addSubscription(subData);
      if (!result.success) {
        setLimitError(true);
      } else {
        setIsModalOpen(false);
      }
    }
  };

  const resetModal = () => {
    setEditingId(null);
    setNewName('');
    setNewAmount('');
    setNewCategory(Category.ENTERTAINMENT);
    setNewCycle(BillingCycle.MONTHLY);
    setNewStatus(SubscriptionStatus.ACTIVE);
    setNewStartDate(new Date().toISOString().split('T')[0]);
    setNewReminderDays(3);
    setIsShared(false);
    setActiveSource('Manual');
    setLimitError(false);
  };

  const handleTabChange = (id: string) => {
    if (id !== 'manage' && !isPremium) {
      navigate('/upgrade');
      return;
    }
    setActiveSubTab(id as any);
  };

  const usagePercent = (subscriptions.length / PLAN_LIMITS.FREE_SUBSCRIPTIONS) * 100;

  return (
    <div className="space-y-10 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Subscriptions</h1>
             {isPremium ? <SyncPulse /> : (
               <div className="px-4 py-1.5 glass rounded-full flex items-center gap-2 border-white/10">
                 <Zap className="w-3 h-3 text-slate-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Standard Flow</span>
               </div>
             )}
          </div>
          <TabSelector 
            tabs={[
              { id: 'manage', label: 'Tracking', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
              { id: 'discover', label: `Discovery`, icon: <RefreshCw className={`w-3.5 h-3.5 ${!isPremium ? 'text-amber-500' : ''}`} /> },
              { id: 'optimize', label: 'Optimizer', icon: <TrendingDown className={`w-3.5 h-3.5 ${!isPremium ? 'text-amber-500' : ''}`} /> }
            ]}
            activeTab={activeSubTab}
            onChange={handleTabChange}
          />
        </div>
        
        {activeSubTab === 'manage' && (
          <button onClick={() => { resetModal(); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-10 py-5 rounded-[2.25rem] font-black shadow-2xl shadow-indigo-300 dark:shadow-none uppercase text-[11px] tracking-widest active:scale-95 transition-all flex items-center gap-3">
            <Plus className="w-5 h-5" strokeWidth={3} /> Initialize Tracker
          </button>
        )}
      </header>

      {/* Plan Capacity Banner */}
      {!isPremium && activeSubTab === 'manage' && (
        <div className="glass p-8 rounded-[3rem] border-white/10 bg-indigo-600/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-6 flex-1 w-full">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600">
               <CreditCard className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Manual Tracking Capacity</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{subscriptions.length} / {PLAN_LIMITS.FREE_SUBSCRIPTIONS} Nodes Active</p>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${usagePercent >= 80 ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/upgrade')}
            className="px-8 py-4 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-md flex items-center gap-2"
          >
            <Crown className="w-4 h-4" /> Expand Neural Core
          </button>
        </div>
      )}

      {activeSubTab === 'manage' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="relative group max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search active trackers..." 
              className="w-full glass rounded-[2.5rem] pl-16 pr-8 py-6 font-bold outline-none border-white/10 shadow-inner focus:ring-4 focus:ring-indigo-600/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredSubs.length === 0 ? (
              <div className="col-span-full py-24 text-center glass rounded-[4rem] border-dashed flex flex-col items-center justify-center gap-6">
                 <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300">
                    <Search className="w-8 h-8" />
                 </div>
                 <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No matching nodes found in your ledger.</p>
              </div>
            ) : filteredSubs.map(sub => (
              <SubscriptionCard 
                key={sub.id} 
                sub={sub} 
                onEdit={openEditModal} 
                onDelete={removeSubscription} 
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </div>
      ) : activeSubTab === 'optimize' ? (
        <SubscriptionOptimizer />
      ) : (
        <div className="space-y-12 animate-in slide-in-from-right duration-500">
           {/* Discovery Tab logic would go here, gated by isPremium in tab change */}
        </div>
      )}

      {/* Unified Tracker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass bg-white dark:bg-slate-900 w-full max-w-lg rounded-[4rem] p-12 relative z-10 shadow-2xl border-white/10 animate-in zoom-in-95 overflow-y-auto max-h-[90vh] no-scrollbar">
            
            {limitError ? (
              <div className="text-center space-y-8 py-10">
                <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto">
                   <AlertTriangle className="w-10 h-10" />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">Node Limit Reached</h2>
                   <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                     Free tier ledger is restricted to <strong>{PLAN_LIMITS.FREE_SUBSCRIPTIONS} active nodes</strong>. Upgrade to Premium for infinite scalability.
                   </p>
                </div>
                <button onClick={() => navigate('/upgrade')} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-3">
                   <Crown className="w-5 h-5" /> Go Premium
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600/10 text-indigo-600 rounded-2xl flex items-center justify-center">
                       {editingId ? <Settings2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                        {editingId ? 'Tracker Settings' : 'Initialize Node'}
                      </h2>
                      {editingId && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Source: {activeSource}</p>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Service Identifier</label>
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none focus:ring-4 focus:ring-indigo-600/10 text-slate-900 dark:text-white border-white/5" placeholder="Netflix, Adobe, AWS..." />
                  </div>

                  {!editingId && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Initial Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                        <input type="number" step="0.01" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} required className="w-full glass rounded-[2rem] pl-14 pr-8 py-5 font-bold outline-none text-slate-900 dark:text-white" placeholder="0.00" />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Billing Interval</label>
                      <select value={newCycle} onChange={(e) => setNewCycle(e.target.value as BillingCycle)} className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none text-slate-900 dark:text-white appearance-none cursor-pointer">
                        {Object.values(BillingCycle).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Status Node</label>
                      <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as SubscriptionStatus)} className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none text-slate-900 dark:text-white appearance-none cursor-pointer">
                        {Object.values(SubscriptionStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Smart Reminder Lead Time</label>
                    <div className="flex gap-2">
                      {[1, 3, 7, 14].map(days => (
                        <button 
                          key={days} 
                          type="button"
                          onClick={() => setNewReminderDays(days)}
                          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${newReminderDays === days ? 'bg-indigo-600 text-white shadow-lg' : 'glass text-slate-400'}`}
                        >
                          {days} Day{days > 1 ? 's' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block">Billing Anchor Date</label>
                    <input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} required className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none text-slate-900 dark:text-white cursor-pointer" />
                  </div>

                  <div className="flex gap-4 pt-6">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-6 text-slate-400 font-black uppercase tracking-widest text-[11px] hover:text-slate-600 transition-colors">Discard</button>
                     <button type="submit" className="flex-[2] bg-indigo-600 text-white py-6 rounded-[2rem] font-black shadow-2xl uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all">
                       {editingId ? 'Sync Updates' : 'Initialize Node'}
                     </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
