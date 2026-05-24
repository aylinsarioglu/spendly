import type { ExpenseCategoryOption } from '../types/expense';

export const expenseCategoryOptions: ExpenseCategoryOption[] = [
  { id: '1', emoji: '🍔', name: 'Yemek' },
  { id: '2', emoji: '🚕', name: 'Ulaşım' },
  { id: '3', emoji: '🛍️', name: 'Alışveriş' },
];

export function getCategoryOptionById(
  id: string,
): ExpenseCategoryOption | undefined {
  return expenseCategoryOptions.find((option) => option.id === id);
}
