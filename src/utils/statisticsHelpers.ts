import type {
  CategorySpending,
  Expense,
  ExpenseStatistics,
  GroupedCategory,
  PieChartSlice,
} from '../types/expense';
import { groupExpensesByCategory } from './groupExpensesByCategory';

const CHART_COLORS = [
  '#6C5CE7',
  '#A29BFE',
  '#FD79A8',
  '#FDCB6E',
  '#00CEC9',
  '#55EFC4',
  '#74B9FF',
] as const;

export function getCategorySummary(expenses: Expense[]): GroupedCategory[] {
  return groupExpensesByCategory(expenses)
    .filter((summary) => summary.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function getExpenseStatistics(expenses: Expense[]): ExpenseStatistics {
  // Use the same full expenses list as Home (shared App state / AsyncStorage).
  const categorySummary = getCategorySummary(expenses);
  const totalSpending = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
  const transactionCount = expenses.length;

  const categorySpending: CategorySpending[] = categorySummary.map(
    (summary) => ({
      category: summary.category,
      emoji: summary.emoji,
      amount: summary.amount,
      count: expenses.filter(
        (expense) => expense.category === summary.category,
      ).length,
    }),
  );

  const topCategory = categorySummary[0];

  return {
    totalSpending,
    transactionCount,
    averageSpending:
      transactionCount > 0
        ? Math.round(totalSpending / transactionCount)
        : 0,
    highestSpendingCategory: topCategory?.category ?? '-',
    highestSpendingCategoryEmoji: topCategory?.emoji ?? '',
    categorySummary,
    categorySpending,
  };
}

export function getPieChartData(
  categorySummary: GroupedCategory[],
  legendFontColor: string,
): PieChartSlice[] {
  return categorySummary
    .filter((item) => item.amount > 0)
    .map((item, index) => ({
      name: item.category,
      population: item.amount,
      color: CHART_COLORS[index % CHART_COLORS.length],
      legendFontColor,
      legendFontSize: 12,
    }));
}
