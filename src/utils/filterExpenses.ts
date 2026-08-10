import type { Expense, SortOption, TransactionFilter } from '../types/expense';
import { getExpenseCreatedAtTime } from './date';
import { searchExpenses } from './searchExpenses';

export function filterExpensesByCategory(
  expenses: Expense[],
  category: TransactionFilter['category'],
): Expense[] {
  if (category === 'Tümü') {
    return expenses;
  }

  return expenses.filter((expense) => expense.category === category);
}

export function sortExpensesByOption(
  expenses: Expense[],
  sortBy: SortOption,
): Expense[] {
  const sorted = [...expenses];

  switch (sortBy) {
    case 'En Yeni':
      return sorted.sort(
        (a, b) =>
          getExpenseCreatedAtTime(b.createdAt) -
          getExpenseCreatedAtTime(a.createdAt),
      );
    case 'En Eski':
      return sorted.sort(
        (a, b) =>
          getExpenseCreatedAtTime(a.createdAt) -
          getExpenseCreatedAtTime(b.createdAt),
      );
    case 'En Yüksek Tutar':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'En Düşük Tutar':
      return sorted.sort((a, b) => a.amount - b.amount);
    default:
      return sorted;
  }
}

export function filterAndSortExpenses(
  expenses: Expense[],
  filter: TransactionFilter,
): Expense[] {
  const filtered = filterExpensesByCategory(expenses, filter.category);
  return sortExpensesByOption(filtered, filter.sortBy);
}

export function getVisibleTransactions(
  expenses: Expense[],
  filter: TransactionFilter,
  searchQuery: string,
): Expense[] {
  const searched = searchExpenses(expenses, searchQuery);
  return filterAndSortExpenses(searched, filter);
}
