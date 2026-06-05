import type {
  CategorySpending,
  Expense,
  ExpenseStatistics,
  PieChartSlice,
} from '../types/expense';

const CHART_COLORS = ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#00CEC9'];

export function getExpenseStatistics(expenses: Expense[]): ExpenseStatistics {
  const categoryMap = new Map<string, CategorySpending>();

  for (const expense of expenses) {
    const existing = categoryMap.get(expense.category);

    if (existing) {
      existing.amount += expense.amount;
      existing.count += 1;
      continue;
    }

    categoryMap.set(expense.category, {
      category: expense.category,
      emoji: expense.emoji,
      amount: expense.amount,
      count: 1,
    });
  }

  const categorySpending = [...categoryMap.values()].sort(
    (a, b) => b.amount - a.amount,
  );

  const mostUsedCategory =
    categorySpending.reduce<CategorySpending | null>((top, item) => {
      if (!top || item.count > top.count) {
        return item;
      }

      return top;
    }, null)?.category ?? '-';

  return {
    totalSpending: expenses.reduce((total, expense) => total + expense.amount, 0),
    transactionCount: expenses.length,
    mostUsedCategory,
    categorySpending,
  };
}

export function getPieChartData(expenses: Expense[]): PieChartSlice[] {
  const { categorySpending } = getExpenseStatistics(expenses);

  return categorySpending.map((item, index) => ({
    name: item.category,
    population: item.amount,
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: '#F5F5F7',
    legendFontSize: 12,
  }));
}
