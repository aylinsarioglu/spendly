import type { ExpenseCategory } from '../types/expense';

export const expenseCategories: ExpenseCategory[] = [
  { id: '1', emoji: '🍔', name: 'Yemek', amount: 1200 },
  { id: '2', emoji: '🚕', name: 'Ulaşım', amount: 700 },
  { id: '3', emoji: '🛍️', name: 'Alışveriş', amount: 950 },
];

export function getTotalExpenses(categories: ExpenseCategory[]): number {
  return categories.reduce((total, category) => total + category.amount, 0);
}
