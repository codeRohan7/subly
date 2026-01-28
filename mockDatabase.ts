
import { Subscription, Expense, DocumentRecord, UserProfile } from './types';
import { MOCK_SUBSCRIPTIONS, MOCK_EXPENSES } from './constants';

const KEYS = {
  SUBS: 'subly_subscriptions',
  EXPENSES: 'subly_expenses',
  DOCS: 'subly_documents',
  USER: 'subly_user'
};

const initialize = () => {
  if (!localStorage.getItem(KEYS.SUBS)) localStorage.setItem(KEYS.SUBS, JSON.stringify(MOCK_SUBSCRIPTIONS));
  if (!localStorage.getItem(KEYS.EXPENSES)) localStorage.setItem(KEYS.EXPENSES, JSON.stringify(MOCK_EXPENSES));
  if (!localStorage.getItem(KEYS.DOCS)) localStorage.setItem(KEYS.DOCS, JSON.stringify([
    { id: '1', type: 'Driving License', name: 'Alex DL', expiryDate: '2028-12-10', status: 'Safe', remindersEnabled: true },
    { id: '2', type: 'Insurance', name: 'Tesla Model 3', expiryDate: '2024-06-20', status: 'Expiring Soon', remindersEnabled: true },
  ]));
};

export const db = {
  getSubscriptions: (): Subscription[] => JSON.parse(localStorage.getItem(KEYS.SUBS) || '[]'),
  saveSubscription: (sub: Subscription) => {
    const subs = db.getSubscriptions();
    const index = subs.findIndex(s => s.id === sub.id);
    if (index > -1) subs[index] = sub;
    else subs.push(sub);
    localStorage.setItem(KEYS.SUBS, JSON.stringify(subs));
  },
  deleteSubscription: (id: string) => {
    const subs = db.getSubscriptions().filter(s => s.id !== id);
    localStorage.setItem(KEYS.SUBS, JSON.stringify(subs));
  },
  getExpenses: (): Expense[] => JSON.parse(localStorage.getItem(KEYS.EXPENSES) || '[]'),
  saveExpense: (exp: Expense) => {
    const exps = db.getExpenses();
    const index = exps.findIndex(e => e.id === exp.id);
    if (index > -1) exps[index] = exp;
    else exps.push(exp);
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(exps));
  },
  deleteExpense: (id: string) => {
    const exps = db.getExpenses().filter(e => e.id !== id);
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(exps));
  },
  getDocuments: (): DocumentRecord[] => JSON.parse(localStorage.getItem(KEYS.DOCS) || '[]'),
  saveDocument: (doc: DocumentRecord) => {
    const docs = db.getDocuments();
    const index = docs.findIndex(d => d.id === doc.id);
    if (index > -1) {
      docs[index] = doc;
    } else {
      docs.push(doc);
    }
    localStorage.setItem(KEYS.DOCS, JSON.stringify(docs));
  },
  deleteDocument: (id: string) => {
    const docs = db.getDocuments().filter(d => d.id !== id);
    localStorage.setItem(KEYS.DOCS, JSON.stringify(docs));
  }
};

initialize();
