
import React from 'react';
import { 
  Tv, 
  Wifi, 
  Briefcase, 
  HeartPulse, 
  DollarSign, 
  CircleDot 
} from 'lucide-react';
import { Category } from './types';

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.ENTERTAINMENT]: <Tv className="w-5 h-5" />,
  [Category.UTILITIES]: <Wifi className="w-5 h-5" />,
  [Category.WORK]: <Briefcase className="w-5 h-5" />,
  [Category.HEALTH]: <HeartPulse className="w-5 h-5" />,
  [Category.FINANCE]: <DollarSign className="w-5 h-5" />,
  [Category.OTHER]: <CircleDot className="w-5 h-5" />,
};

export const MOCK_SUBSCRIPTIONS = [
  {
    id: '1',
    name: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    cycle: 'Monthly',
    category: Category.ENTERTAINMENT,
    status: 'Active',
    nextBillingDate: '2024-05-15',
    source: 'Manual',
    icon: 'https://picsum.photos/seed/netflix/100/100'
  },
  {
    id: '2',
    name: 'Spotify Family',
    amount: 16.99,
    currency: 'USD',
    cycle: 'Monthly',
    category: Category.ENTERTAINMENT,
    status: 'Active',
    nextBillingDate: '2024-05-20',
    source: 'Email',
    icon: 'https://picsum.photos/seed/spotify/100/100'
  },
  {
    id: '3',
    name: 'iCloud+',
    amount: 9.99,
    currency: 'USD',
    cycle: 'Monthly',
    category: Category.UTILITIES,
    status: 'Active',
    nextBillingDate: '2024-05-28',
    source: 'App Store',
    icon: 'https://picsum.photos/seed/icloud/100/100'
  }
];

// Added MOCK_EXPENSES to be used for AI insights analysis and across expense views
export const MOCK_EXPENSES = [
  { id: '1', title: 'Grocery Store', amount: 84.50, category: 'Food', date: '2024-05-18', isSubscription: false },
  { id: '2', title: 'Netflix', amount: 15.99, category: 'Entertainment', date: '2024-05-15', isSubscription: true },
  { id: '3', title: 'Gas Station', amount: 45.00, category: 'Transport', date: '2024-05-14', isSubscription: false },
];
