import type { Expense } from '../types/expense';

const DAY_MS = 24 * 60 * 60 * 1000;
const now = Date.now();

export const initialExpenses: Expense[] = [
  {
    id: '1',
    amount: 1200,
    category: 'Yemek',
    emoji: '🍔',
    note: '',
    createdAt: new Date(now - 1 * DAY_MS).toISOString(),
  },
  {
    id: '2',
    amount: 700,
    category: 'Ulaşım',
    emoji: '🚕',
    note: '',
    createdAt: new Date(now - 2 * DAY_MS).toISOString(),
  },
  {
    id: '3',
    amount: 950,
    category: 'Alışveriş',
    emoji: '🛍️',
    note: '',
    createdAt: new Date(now - 3 * DAY_MS).toISOString(),
  },
];
