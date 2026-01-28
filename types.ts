
export enum BillingCycle {
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
  WEEKLY = 'Weekly',
  CUSTOM = 'Custom'
}

export enum SubscriptionStatus {
  ACTIVE = 'Active',
  CANCELLED = 'Cancelled',
  EXPIRED = 'Expired',
  PAUSED = 'Paused'
}

export enum Category {
  ENTERTAINMENT = 'Entertainment',
  UTILITIES = 'Utilities',
  WORK = 'Work',
  HEALTH = 'Health',
  FINANCE = 'Finance',
  OTHER = 'Other'
}

export interface UserConsents {
  emailSync: boolean;
  appleIdSync: boolean;
  deviceScan: boolean;
  analytics: boolean;
  digiLockerSync: boolean;
  pushNotifications: boolean; // Added
  emailNotifications: boolean; // Added
}

export interface UserProfile {
  name: string;
  email: string;
  currency: string;
  budgetLimit: number;
  tier: 'Free' | 'Premium';
  consents: UserConsents;
  vaultKeySet: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  previousAmount?: number;
  currency: string;
  cycle: BillingCycle;
  category: Category;
  status: SubscriptionStatus;
  nextBillingDate: string;
  reminderDays: number; // Lead time for alerts
  icon?: string;
  source: 'Manual' | 'Email' | 'App Store' | 'Device Scan' | 'AI Sync';
  isShared?: boolean;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  isSubscription: boolean;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface GroupMember {
  name: string;
  email: string;
  avatar?: string;
}

export interface GroupInvitation {
  id: string;
  groupName: string;
  invitedBy: string;
  date: string;
}

export interface Group {
  id: string;
  name: string;
  members: GroupMember[];
  expenses: Expense[];
}

export interface SplitParticipant {
  name: string;
  amount: number;
  hasPaid: boolean;
}

export interface SplitExpense {
  id: string;
  description: string;
  totalAmount: number;
  date: string;
  paidBy: string;
  participants: SplitParticipant[];
  groupId?: string;
}

export type DocumentType = 'Driving License' | 'Pollution Certificate' | 'Insurance' | 'Passport' | 'Vehicle Registration' | 'Other';

export interface DocumentRecord {
  id: string;
  type: DocumentType;
  name: string;
  expiryDate: string;
  fileName?: string;
  remindersEnabled: boolean;
  status: 'Safe' | 'Expiring Soon' | 'Expired';
}

export interface AIInsight {
  title: string;
  description: string;
  type: 'saving' | 'warning' | 'tip' | 'leakage';
}

export interface PlanAlternative {
  serviceName: string;
  currentPlan: string;
  suggestedPlan: string;
  savings: number;
  reason: string;
}

export type Theme = 'light' | 'dark';

export interface SmartAlert {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'bill' | 'vault' | 'ai' | 'price' | 'sync' | 'invite';
  severity: 'info' | 'warning' | 'critical';
}
