
import { BillingCycle } from '../types';

export const calculateNextBillingDate = (startDate: string, cycle: BillingCycle): string => {
  const date = new Date(startDate);
  const now = new Date();

  // If the start date is in the future, that's our next billing date
  if (date > now) return date.toISOString().split('T')[0];

  while (date <= now) {
    switch (cycle) {
      case BillingCycle.WEEKLY:
        date.setDate(date.getDate() + 7);
        break;
      case BillingCycle.MONTHLY:
        date.setMonth(date.getMonth() + 1);
        break;
      case BillingCycle.YEARLY:
        date.setFullYear(date.getFullYear() + 1);
        break;
      case BillingCycle.CUSTOM:
        // Default to monthly for custom if not specified, or could be expanded
        date.setMonth(date.getMonth() + 1);
        break;
    }
  }

  return date.toISOString().split('T')[0];
};
