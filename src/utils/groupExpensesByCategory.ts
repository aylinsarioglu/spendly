import type { Expense, GroupedCategory } from '../types/expense';

export function groupExpensesByCategory(expenses: Expense[]): GroupedCategory[] {
  return expenses.reduce<GroupedCategory[]>((groups, expense) => {
    const existing = groups.find((group) => group.category === expense.category);

    if (existing) {
      existing.amount += expense.amount;
      return groups;
    }

    groups.push({
      category: expense.category,
      emoji: expense.emoji,
      amount: expense.amount,
    });

    return groups;
  }, []);
}
