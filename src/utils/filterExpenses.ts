import type { Expense, TransactionFilter } from '../types/expense';

function getExpenseTimestamp(expense: Expense): number {
  const parsed = Number(expense.id);
  return Number.isFinite(parsed) ? parsed : 0;
}

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
        (a, b) => getExpenseTimestamp(b) - getExpenseTimestamp(a),
      );
    case 'En Eski':
      return filtered.sort(
        (a, b) => getExpenseTimestamp(a) - getExpenseTimestamp(b),
      );
    case 'En Yüksek Tutar':
      return filtered.sort((a, b) => b.amount - a.amount);
    case 'En Düşük Tutar':
      return filtered.sort((a, b) => a.amount - b.amount);
    default:
      return filtered;
  }
}
