import type {
  CategorySpending,
  Expense,
  ExpenseStatistics,
  GroupedCategory,
  PieChartSlice,
} from '../types/expense';
import { getCategoryVisual } from '../theme/categoryVisuals';
import { groupExpensesByCategory } from './groupExpensesByCategory';

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
    .map((item) => ({
      name: item.category,
      population: item.amount,
      color: getCategoryVisual(item.category).chartColor,
      legendFontColor,
      legendFontSize: 12,
    }));
}
