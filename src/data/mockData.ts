import type { Expense } from '../types/expense';

export const initialExpenses: Expense[] = [
  {
    id: '1',
    amount: 1200,
    category: 'Yemek',
    emoji: '🍔',
    note: '',
    createdAt: '2026-08-09T10:00:00.000Z',
  },
  {
    id: '2',
    amount: 700,
    category: 'Ulaşım',
    emoji: '🚕',
    note: '',
    createdAt: '2026-08-08T14:30:00.000Z',
  },
  {
    id: '3',
    amount: 950,
    category: 'Alışveriş',
    emoji: '🛍️',
    note: '',
    createdAt: '2026-08-07T09:15:00.000Z',
  },
];
