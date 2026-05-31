import type { Expense } from '../types/expense';

export const initialExpenses: Expense[] = [
  {
    id: '1',
    amount: 1200,
    category: 'Yemek',
    emoji: '🍔',
    note: '',
  },
  {
    id: '2',
    amount: 700,
    category: 'Ulaşım',
    emoji: '🚕',
    note: '',
  },
  {
    id: '3',
    amount: 950,
    category: 'Alışveriş',
    emoji: '🛍️',
    note: '',
  },
];
