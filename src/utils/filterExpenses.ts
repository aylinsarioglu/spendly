import type { Expense, TransactionFilter } from '../types/expense';
import { getExpenseCreatedAtTime } from './date';

export function filterAndSortExpenses(
  expenses: Expense[],
  filter: TransactionFilter,
): Expense[] {
  const filtered =
    filter.category === 'Tümü'
      ? [...expenses]
      : expenses.filter((expense) => expense.category === filter.category);

  switch (filter.sortBy) {
    case 'En Yeni':
      return filtered.sort(
        (a, b) =>
          getExpenseCreatedAtTime(b.createdAt) -
          getExpenseCreatedAtTime(a.createdAt),
      );
    case 'En Eski':
      return filtered.sort(
        (a, b) =>
          getExpenseCreatedAtTime(a.createdAt) -
          getExpenseCreatedAtTime(b.createdAt),
      );
    case 'En Yüksek Tutar':
      return filtered.sort((a, b) => b.amount - a.amount);
    case 'En Düşük Tutar':
      return filtered.sort((a, b) => a.amount - b.amount);
    default:
      return filtered;
  }
}
