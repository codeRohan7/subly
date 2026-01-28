
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Subscription, Expense, DocumentRecord, UserProfile, SplitExpense, Theme, SmartAlert, UserConsents, Group, GroupInvitation } from './types';
import { apiService } from './apiService';

export const PLAN_LIMITS = {
  FREE_SUBSCRIPTIONS: 5,
  FREE_DOCUMENTS: 3
};

interface AppState {
  subscriptions: Subscription[];
  expenses: Expense[];
  splits: SplitExpense[];
  groups: Group[];
  invitations: GroupInvitation[];
  documents: DocumentRecord[];
  alerts: SmartAlert[];
  pendingSync: Subscription[];
  user: UserProfile;
  theme: Theme;
  isLoading: boolean;
  isPremium: boolean;
  toggleTheme: () => void;
  upgradeToPremium: () => void;
  updateConsents: (consents: Partial<UserConsents>) => void;
  updateBudget: (limit: number) => void;
  updateCurrency: (curr: string) => void;
  setVaultKey: () => void;
  refreshAll: () => Promise<void>;
  addSubscription: (sub: Subscription) => Promise<{ success: boolean; error?: string }>;
  updateSubscription: (sub: Subscription) => Promise<void>;
  removeSubscription: (id: string) => Promise<void>;
  approveSyncItem: (id: string) => Promise<{ success: boolean; error?: string }>;
  ignoreSyncItem: (id: string) => void;
  setPendingSync: (items: Subscription[]) => void;
  addExpense: (exp: Expense) => Promise<void>;
  updateExpense: (exp: Expense) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  inviteToGroup: (groupId: string, email: string) => Promise<void>;
  acceptInvitation: (id: string) => Promise<void>;
  addSplit: (split: SplitExpense) => Promise<void>;
  removeSplit: (id: string) => Promise<void>;
  settleSplit: (splitId: string, participantName: string) => Promise<void>;
  addDocument: (doc: DocumentRecord) => Promise<{ success: boolean; error?: string }>;
  removeDocument: (id: string) => Promise<void>;
  purgeAllData: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [splits, setSplits] = useState<SplitExpense[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [pendingSync, setPendingSyncState] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('subly_theme') as Theme) || 'dark');
  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('subly_user_profile');
    if (savedUser) return JSON.parse(savedUser);
    return {
      name: 'Alpha User',
      email: 'alpha@nebula.io',
      currency: 'USD',
      budgetLimit: 1500,
      tier: 'Free',
      consents: { emailSync: false, appleIdSync: false, deviceScan: false, analytics: true, digiLockerSync: false, pushNotifications: true, emailNotifications: true },
      vaultKeySet: false
    };
  });

  const isPremium = user.tier === 'Premium';

  const calculateAlerts = (subs: Subscription[], docs: DocumentRecord[], pending: Subscription[], invites: GroupInvitation[]) => {
    const newAlerts: SmartAlert[] = [];
    const today = new Date();

    // Group features are Premium
    if (isPremium && invites.length > 0) {
      newAlerts.push({
        id: 'group-invite',
        title: 'Cluster Request',
        description: `Invited to join "${invites[0].groupName}"`,
        date: today.toISOString(),
        type: 'invite',
        severity: 'info'
      });
    }

    // Auto-sync notifications are Premium
    if (isPremium && pending.length > 0) {
      newAlerts.push({
        id: 'sync-pending',
        title: 'Footprint Update',
        description: `${pending.length} new billing nodes detected`,
        date: today.toISOString(),
        type: 'sync',
        severity: 'info'
      });
    }

    subs.forEach(sub => {
      const nextDate = new Date(sub.nextBillingDate);
      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Price Hike detection is Premium
      if (isPremium && sub.previousAmount && sub.amount > sub.previousAmount) {
        newAlerts.push({
          id: `price-hike-${sub.id}`,
          title: 'Price Anomaly',
          description: `${sub.name} increased by $${(sub.amount - sub.previousAmount).toFixed(2)}`,
          date: today.toISOString(),
          type: 'price',
          severity: 'critical'
        });
      }

      // Basic renewal alerts for everyone
      if (diffDays >= 0 && diffDays <= (sub.reminderDays || 3)) {
        newAlerts.push({
          id: `renewal-${sub.id}`,
          title: 'Upcoming Renewal',
          description: `${sub.name} will bill $${sub.amount} in ${diffDays} days`,
          date: today.toISOString(),
          type: 'bill',
          severity: diffDays <= 1 ? 'critical' : 'warning'
        });
      }
    });

    const totalSpent = subs.reduce((acc, s) => acc + s.amount, 0);
    if (totalSpent > user.budgetLimit) {
      newAlerts.push({
        id: 'budget-overspend',
        title: 'Budget Leakage',
        description: `Exceeded allocation by $${(totalSpent - user.budgetLimit).toFixed(2)}`,
        date: today.toISOString(),
        type: 'ai',
        severity: 'critical'
      });
    }

    setAlerts(newAlerts);
  };

  const refreshAll = async () => {
    setIsLoading(true);
    const [subs, exps, docs] = await Promise.all([
      apiService.getSubscriptions(),
      apiService.getExpenses(),
      apiService.getDocuments()
    ]);
    const savedSplits = JSON.parse(localStorage.getItem('subly_splits') || '[]');
    const savedPending = JSON.parse(localStorage.getItem('subly_pending_sync') || '[]');
    const savedGroups = JSON.parse(localStorage.getItem('subly_groups') || '[]');
    const savedInvites = JSON.parse(localStorage.getItem('subly_invitations') || '[]');

    setSubscriptions(subs);
    setExpenses(exps);
    setDocuments(docs);
    setSplits(savedSplits);
    setGroups(savedGroups);
    setInvitations(savedInvites);
    setPendingSyncState(savedPending);
    calculateAlerts(subs, docs, savedPending, savedInvites);
    setIsLoading(false);
  };

  useEffect(() => { refreshAll(); }, [user.tier]);

  const saveUser = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem('subly_user_profile', JSON.stringify(u));
  };

  return (
    <AppContext.Provider value={{
      subscriptions, expenses, splits, groups, invitations, documents, alerts, pendingSync, user, theme, isLoading, isPremium,
      toggleTheme: () => { const nt = theme === 'light' ? 'dark' : 'light'; setTheme(nt); localStorage.setItem('subly_theme', nt); },
      upgradeToPremium: () => { saveUser({ ...user, tier: 'Premium' }); },
      updateConsents: (c) => { saveUser({ ...user, consents: { ...user.consents, ...c } }); },
      updateBudget: (limit) => { saveUser({ ...user, budgetLimit: limit }); },
      updateCurrency: (curr) => { saveUser({ ...user, currency: curr }); },
      setVaultKey: () => { saveUser({ ...user, vaultKeySet: true }); },
      refreshAll,
      addSubscription: async (sub) => {
        if (!isPremium && subscriptions.length >= PLAN_LIMITS.FREE_SUBSCRIPTIONS) {
          return { success: false, error: 'FREE_LIMIT_REACHED' };
        }
        await apiService.addSubscription(sub);
        refreshAll();
        return { success: true };
      },
      updateSubscription: async (sub) => { await apiService.addSubscription(sub); refreshAll(); },
      removeSubscription: async (id) => { await apiService.deleteSubscription(id); refreshAll(); },
      approveSyncItem: async (id) => {
        if (!isPremium && subscriptions.length >= PLAN_LIMITS.FREE_SUBSCRIPTIONS) {
          return { success: false, error: 'FREE_LIMIT_REACHED' };
        }
        const item = pendingSync.find(p => p.id === id);
        if (item) {
          await apiService.addSubscription(item);
          const remaining = pendingSync.filter(p => p.id !== id);
          setPendingSyncState(remaining);
          localStorage.setItem('subly_pending_sync', JSON.stringify(remaining));
          await refreshAll();
          return { success: true };
        }
        return { success: false, error: 'NOT_FOUND' };
      },
      ignoreSyncItem: (id) => {
        const remaining = pendingSync.filter(p => p.id !== id);
        setPendingSyncState(remaining);
        localStorage.setItem('subly_pending_sync', JSON.stringify(remaining));
      },
      setPendingSync: (items) => {
        setPendingSyncState(items);
        localStorage.setItem('subly_pending_sync', JSON.stringify(items));
      },
      addExpense: async (e) => { await apiService.addExpense(e); refreshAll(); },
      updateExpense: async (e) => {
        const updated = { ...e, lastModifiedBy: user.name, lastModifiedDate: new Date().toISOString() };
        await apiService.addExpense(updated);
        refreshAll();
      },
      removeExpense: async (id) => { await apiService.deleteExpense(id); refreshAll(); },
      createGroup: async (name) => {
        if (!isPremium) return;
        const nGroup: Group = { id: Date.now().toString(), name, members: [{ name: user.name, email: user.email }], expenses: [] };
        const updated = [...groups, nGroup];
        setGroups(updated);
        localStorage.setItem('subly_groups', JSON.stringify(updated));
      },
      inviteToGroup: async (groupId, email) => {
        if (!isPremium) return;
        console.log(`Invited ${email} to group ${groupId}`);
      },
      acceptInvitation: async (id) => {
        if (!isPremium) return;
        const invite = invitations.find(i => i.id === id);
        if (invite) {
          const nInvites = invitations.filter(i => i.id !== id);
          setInvitations(nInvites);
          localStorage.setItem('subly_invitations', JSON.stringify(nInvites));
          await refreshAll();
        }
      },
      addSplit: async (s) => { if(!isPremium) return; const n = [...splits, s]; setSplits(n); localStorage.setItem('subly_splits', JSON.stringify(n)); },
      removeSplit: async (id) => { if(!isPremium) return; const n = splits.filter(s => s.id !== id); setSplits(n); localStorage.setItem('subly_splits', JSON.stringify(n)); },
      settleSplit: async (splitId, name) => {
        if(!isPremium) return;
        const updated = splits.map(s => s.id === splitId ? {
          ...s,
          participants: s.participants.map(p => p.name === name ? { ...p, hasPaid: !p.hasPaid } : p)
        } : s);
        setSplits(updated);
        localStorage.setItem('subly_splits', JSON.stringify(updated));
      },
      addDocument: async (d) => {
        if (!isPremium && documents.length >= PLAN_LIMITS.FREE_DOCUMENTS) {
          return { success: false, error: 'FREE_LIMIT_REACHED' };
        }
        await apiService.uploadDocument(d);
        refreshAll();
        return { success: true };
      },
      removeDocument: async (id) => { await apiService.deleteDocument(id); refreshAll(); },
      purgeAllData: () => { localStorage.clear(); window.location.reload(); }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
