import type { Expense } from '../types/expense';

export function matchesExpenseSearch(
  expense: Expense,
  searchQuery: string,
): boolean {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return (
    expense.category.toLowerCase().includes(normalizedQuery) ||
    expense.note.toLowerCase().includes(normalizedQuery)
  );
}

export function searchExpenses(
  expenses: Expense[],
  searchQuery: string,
): Expense[] {
  if (!searchQuery.trim()) {
    return expenses;
  }

  return expenses.filter((expense) =>
    matchesExpenseSearch(expense, searchQuery),
  );
}
