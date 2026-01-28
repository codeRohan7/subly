
import React, { useState } from 'react';
import { 
  Plus, Receipt, X, Trash2, Users, ReceiptText, 
  UserPlus, Calendar, PieChart as PieChartIcon,
  BarChart3, DollarSign, Sparkles, Check, Edit3, Mail, Clock, Info, Crown
} from 'lucide-react';
import { useApp } from '../AppContext';
import { Expense, SplitExpense, Group, Category } from '../types';
import { useNavigate } from 'react-router-dom';

const Expenses: React.FC = () => {
  const { 
    expenses, splits, groups, invitations, user,
    addExpense, updateExpense, removeExpense, 
    addSplit, removeSplit, settleSplit, 
    createGroup, inviteToGroup, acceptInvitation,
    isPremium 
  } = useApp();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'transactions' | 'groups' | 'analytics'>('transactions');
  
  // Modals
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<string | null>(null);

  // Form States
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState<Category>(Category.OTHER);
  const [formGroupEmail, setFormGroupEmail] = useState('');
  const [formGroupName, setFormGroupName] = useState('');

  const openExpenseModal = (exp?: Expense) => {
    if (exp) {
      setEditingExpense(exp);
      setFormTitle(exp.title);
      setFormAmount(exp.amount.toString());
      setFormCategory(exp.category as Category);
    } else {
      setEditingExpense(null);
      setFormTitle('');
      setFormAmount('');
      setFormCategory(Category.OTHER);
    }
    setIsExpenseModalOpen(true);
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAmount) return;

    const expenseData: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      title: formTitle,
      amount: parseFloat(formAmount),
      category: formCategory,
      date: editingExpense?.date || new Date().toISOString().split('T')[0],
      isSubscription: editingExpense?.isSubscription || false
    };

    if (editingExpense) {
      await updateExpense(expenseData);
    } else {
      await addExpense(expenseData);
    }
    setIsExpenseModalOpen(false);
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formGroupName || !isPremium) return;
    await createGroup(formGroupName);
    setFormGroupName('');
    setIsGroupModalOpen(false);
  };

  const handleInvitationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formGroupEmail || !isInviteModalOpen || !isPremium) return;
    await inviteToGroup(isInviteModalOpen, formGroupEmail);
    setFormGroupEmail('');
    setIsInviteModalOpen(null);
  };

  const handleTabChange = (tab: 'transactions' | 'groups' | 'analytics') => {
    if (tab !== 'transactions' && !isPremium) {
      navigate('/upgrade');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Nebula Ledger</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Temporal flow & group clusters</p>
        </div>
        <div className="flex p-1.5 glass rounded-2xl shadow-xl">
            <button onClick={() => handleTabChange('transactions')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'transactions' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500'}`}>Private Ledger</button>
            <button onClick={() => handleTabChange('groups')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'groups' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500'}`}>
              Shared Hubs {!isPremium && <Crown className="w-3 h-3 opacity-40" />}
            </button>
            <button onClick={() => handleTabChange('analytics')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500'}`}>
              Deep Scan {!isPremium && <Crown className="w-3 h-3 opacity-40" />}
            </button>
        </div>
      </header>

      {activeTab === 'transactions' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Transaction Logs</h3>
              <button onClick={() => openExpenseModal()} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl uppercase text-[10px] tracking-widest active:scale-95 transition-all flex items-center gap-3">
                <Plus className="w-5 h-5" /> Log Entry
              </button>
           </div>
           
           <div className="glass rounded-[3rem] overflow-hidden border-white/10 shadow-2xl bg-white/50 dark:bg-slate-900/50">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-100 dark:bg-white/5 border-b border-white/10">
                   <tr>
                     <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date / Category</th>
                     <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Descriptor</th>
                     <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Value</th>
                     <th className="px-10 py-6 text-right w-32">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                   {expenses.length === 0 ? (
                     <tr><td colSpan={4} className="px-10 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No entries in private vault</td></tr>
                   ) : expenses.map(exp => (
                     <tr key={exp.id} className="hover:bg-indigo-600/5 transition-colors group">
                       <td className="px-10 py-6">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 tabular-nums">{exp.date}</span>
                            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-1">{exp.category}</span>
                         </div>
                       </td>
                       <td className="px-10 py-6">
                         <div className="flex items-center gap-3">
                            <span className="font-black text-slate-900 dark:text-white tracking-tight">{exp.title}</span>
                            {exp.lastModifiedBy && (
                              <div className="group relative">
                                <Info className="w-3.5 h-3.5 text-amber-500 cursor-help" />
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block glass p-3 rounded-xl min-w-[200px] z-20 text-[9px] font-black uppercase tracking-widest text-amber-600 shadow-xl border-amber-500/20">
                                  Modified by {exp.lastModifiedBy} on {new Date(exp.lastModifiedDate!).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                         </div>
                       </td>
                       <td className="px-10 py-6 text-right font-black text-slate-900 dark:text-white tabular-nums text-lg">${exp.amount.toFixed(2)}</td>
                       <td className="px-10 py-6 text-right">
                         <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openExpenseModal(exp)} className="p-2.5 glass rounded-xl text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-800 shadow-sm transition-all"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => removeExpense(exp.id)} className="p-2.5 glass rounded-xl text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-800 shadow-sm transition-all"><Trash2 className="w-4 h-4" /></button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}

      {activeTab === 'groups' && isPremium && (
        <div className="space-y-12 animate-in slide-in-from-right duration-500">
           {/* Invitations Section */}
           {invitations.length > 0 && (
             <section className="space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 flex items-center gap-2">
                   <Clock className="w-4 h-4 animate-pulse" /> Pending Cluster Requests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {invitations.map(inv => (
                     <div key={inv.id} className="glass p-8 rounded-[2.5rem] bg-indigo-600/5 border-indigo-500/10 flex flex-col justify-between group">
                        <div className="space-y-2">
                           <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{inv.groupName}</h4>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Invited by: {inv.invitedBy}</p>
                        </div>
                        <div className="flex gap-3 mt-8">
                           <button onClick={() => acceptInvitation(inv.id)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg">Link</button>
                           <button className="flex-1 py-3 glass text-slate-400 rounded-xl font-black uppercase text-[9px] tracking-widest">Abort</button>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
           )}

           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-3"><Users className="w-6 h-6 text-indigo-500" /> Collaboration Hub</h3>
              <button onClick={() => setIsGroupModalOpen(true)} className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl uppercase text-[10px] tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3">
                <Plus className="w-5 h-5" /> Initialize Cluster
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {groups.length === 0 ? (
                <div className="col-span-full py-24 glass rounded-[4rem] border-dashed border-2 text-center space-y-4">
                   <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-300"><Users className="w-10 h-10" /></div>
                   <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active sharing clusters detected</p>
                </div>
              ) : groups.map(group => (
                <div key={group.id} className="glass p-10 rounded-[4rem] border-white/10 shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-indigo-600/[0.02] -z-10 group-hover:bg-indigo-600/[0.05] transition-colors"></div>
                   
                   <div className="flex justify-between items-start mb-10">
                      <div>
                        <h4 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">{group.name}</h4>
                        <div className="flex items-center gap-3 mt-4">
                           <div className="flex -space-x-3">
                              {group.members.map((m, i) => (
                                <div key={i} title={m.name} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shadow-lg uppercase">
                                  {m.name[0]}
                                </div>
                              ))}
                           </div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{group.members.length} Nodes linked</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setIsInviteModalOpen(group.id)} className="p-3.5 glass rounded-2xl text-indigo-600 bg-white dark:bg-slate-800 shadow-md transition-all hover:scale-105" title="Invite User">
                           <UserPlus className="w-5 h-5" />
                        </button>
                        <button className="p-3.5 glass rounded-2xl text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-800 shadow-md transition-all">
                           <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                   </div>

                   <div className="space-y-4 mt-8">
                      <div className="p-6 glass bg-white/40 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-between group/split">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Receipt className="w-6 h-6" /></div>
                            <div>
                               <p className="font-black text-slate-900 dark:text-white leading-none">Shared Ledger Active</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time sync enabled</p>
                            </div>
                         </div>
                         <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">Manage Split</button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Expense Modal (Create/Edit) */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsExpenseModalOpen(false)}></div>
          <div className="glass bg-white dark:bg-slate-900 w-full max-w-lg rounded-[4rem] p-12 relative z-10 shadow-2xl border-white/10 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{editingExpense ? 'Modify Log' : 'Create Entry'}</h2>
               <button onClick={() => setIsExpenseModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleExpenseSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Descriptor</label>
                <input autoFocus type="text" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none text-slate-900 dark:text-white border-white/5" placeholder="e.g. AWS Compute, Dinner" />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Value (USD)</label>
                  <input type="number" step="0.01" required value={formAmount} onChange={(e) => setFormAmount(e.target.value)} className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none text-slate-900 dark:text-white" placeholder="0.00" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Classification</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as Category)} className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none text-slate-900 dark:text-white appearance-none cursor-pointer">
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                 <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px]">Abort</button>
                 <button type="submit" className="flex-[2] py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl">Commit Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cluster/Group Creation Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsGroupModalOpen(false)}></div>
          <div className="glass bg-white dark:bg-slate-900 w-full max-w-lg rounded-[4rem] p-12 relative z-10 shadow-2xl border-white/10 animate-in zoom-in-95">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><Users className="w-6 h-6" /></div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Initialize Cluster</h2>
            </div>
            <form onSubmit={handleGroupSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Cluster Name</label>
                <input autoFocus type="text" required value={formGroupName} onChange={(e) => setFormGroupName(e.target.value)} className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none text-slate-900 dark:text-white" placeholder="e.g. Roommates, Work Trip" />
              </div>
              <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl">Establish Connectivity</button>
            </form>
          </div>
        </div>
      )}

      {/* Invitation Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsInviteModalOpen(null)}></div>
          <div className="glass bg-white dark:bg-slate-900 w-full max-w-lg rounded-[4rem] p-12 relative z-10 shadow-2xl border-white/10 animate-in zoom-in-95">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 bg-indigo-600/10 text-indigo-600 rounded-2xl flex items-center justify-center"><Mail className="w-6 h-6" /></div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Link Participant</h2>
            </div>
            <form onSubmit={handleInvitationSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Node Identifier (Email)</label>
                <input autoFocus type="email" required value={formGroupEmail} onChange={(e) => setFormGroupEmail(e.target.value)} className="w-full glass rounded-[2rem] px-8 py-5 font-bold outline-none text-slate-900 dark:text-white" placeholder="user@nebula.io" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed text-center px-6">
                An encrypted invitation packet will be dispatched to this node's inbox.
              </p>
              <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl">Dispatch Invitation</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
