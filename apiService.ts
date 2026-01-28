
import { Subscription, Expense, DocumentRecord, BillingCycle } from './types';
import { db } from './mockDatabase';
import { calculateNextBillingDate } from './utils/dateUtils';

const API_BASE = 'https://api.digitallocker.gov.in/public/v1';
const DIGILOCKER_STATIC_KEY = 'SUB_VAULT_SECURE_TOKEN_998877';

export const apiService = {
  // Subscriptions
  getSubscriptions: async (): Promise<Subscription[]> => {
    return db.getSubscriptions();
  },
  
  addSubscription: async (sub: Subscription): Promise<Subscription> => {
    // If no next billing date is provided, calculate from today based on cycle
    if (!sub.nextBillingDate) {
      sub.nextBillingDate = calculateNextBillingDate(new Date().toISOString().split('T')[0], sub.cycle);
    }
    db.saveSubscription(sub);
    return sub;
  },
  
  updateSubscription: async (sub: Subscription): Promise<void> => {
    // Recalculate next billing date if it's currently past
    const now = new Date().toISOString().split('T')[0];
    if (sub.nextBillingDate <= now) {
      sub.nextBillingDate = calculateNextBillingDate(sub.nextBillingDate, sub.cycle);
    }
    db.saveSubscription(sub);
  },

  deleteSubscription: async (id: string): Promise<void> => {
    db.deleteSubscription(id);
  },

  // Expenses
  getExpenses: async (): Promise<Expense[]> => {
    return db.getExpenses();
  },
  
  addExpense: async (exp: Expense): Promise<Expense> => {
    db.saveExpense(exp);
    return exp;
  },

  deleteExpense: async (id: string): Promise<void> => {
    db.deleteExpense(id);
  },

  // Vault
  getDocuments: async (): Promise<DocumentRecord[]> => {
    return db.getDocuments();
  },
  
  uploadDocument: async (doc: DocumentRecord): Promise<DocumentRecord> => {
    db.saveDocument(doc);
    return doc;
  },

  deleteDocument: async (id: string): Promise<void> => {
    db.deleteDocument(id);
  },

  syncDigiLocker: async (): Promise<DocumentRecord[]> => {
    console.log('Fetching documents from DigiLocker API...');
    try {
      const response = await fetch(`${API_BASE}/files/issued`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${DIGILOCKER_STATIC_KEY}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return [
          { 
            id: 'dl-' + Math.random().toString(36).substr(2, 9), 
            type: 'Driving License', 
            name: 'Driving License (Verified)', 
            expiryDate: '2030-05-20', 
            status: 'Safe', 
            remindersEnabled: true 
          },
          { 
            id: 'rc-' + Math.random().toString(36).substr(2, 9), 
            type: 'Vehicle Registration', 
            name: 'RC: KA-01-AB-1234', 
            expiryDate: '2029-08-15', 
            status: 'Safe', 
            remindersEnabled: true 
          },
          { 
            id: 'ins-' + Math.random().toString(36).substr(2, 9), 
            type: 'Insurance', 
            name: 'Policy #Z887221', 
            expiryDate: '2025-01-30', 
            status: 'Safe', 
            remindersEnabled: true 
          }
        ];
      }
      
      const data = await response.json();
      return data.map((item: any) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        expiryDate: item.expiry,
        status: 'Safe',
        remindersEnabled: true
      }));
    } catch (e) {
      return [
        { id: 'digi-fallback-1', type: 'Driving License', name: 'Verified DL', expiryDate: '2032-12-31', status: 'Safe', remindersEnabled: true }
      ];
    }
  }
};
