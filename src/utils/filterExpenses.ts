import type { Expense, TransactionFilter } from '../types/expense';
import { getExpenseCreatedAtTime } from './date';
import { searchExpenses } from './searchExpenses';

function sortExpenses(
  expenses: Expense[],
  sortBy: TransactionFilter['sortBy'],
): Expense[] {
  const sorted = [...expenses];

  switch (sortBy) {
    case 'Newest':
      return sorted.sort(
        (a, b) =>
          getExpenseCreatedAtTime(b.createdAt) -
          getExpenseCreatedAtTime(a.createdAt),
      );
    case 'Oldest':
      return sorted.sort(
        (a, b) =>
          getExpenseCreatedAtTime(a.createdAt) -
          getExpenseCreatedAtTime(b.createdAt),
      );
    case 'Highest Amount':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'Lowest Amount':
      return sorted.sort((a, b) => a.amount - b.amount);
    default:
      return sorted;
  }
}

export function filterAndSortExpenses(
  expenses: Expense[],
  filter: TransactionFilter,
): Expense[] {
  const filtered =
    filter.category === 'All'
      ? expenses
      : expenses.filter((expense) => expense.category === filter.category);

  return sortExpenses(filtered, filter.sortBy);
}

export function getVisibleTransactions(
  expenses: Expense[],
  filter: TransactionFilter,
  searchQuery: string,
): Expense[] {
  const searched = searchExpenses(expenses, searchQuery);
  return filterAndSortExpenses(searched, filter);
}
