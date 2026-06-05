import type {
  CategorySpending,
  Expense,
  ExpenseStatistics,
  GroupedCategory,
  PieChartSlice,
} from '../types/expense';
import { groupExpensesByCategory } from './groupExpensesByCategory';

const CHART_COLORS = ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#00CEC9'];

export function getCategorySummary(expenses: Expense[]): GroupedCategory[] {
  return groupExpensesByCategory(expenses).sort((a, b) => b.amount - a.amount);
}

export function getExpenseStatistics(expenses: Expense[]): ExpenseStatistics {
  const categorySummary = getCategorySummary(expenses);

  const categorySpending: CategorySpending[] = categorySummary.map((summary) => ({
    category: summary.category,
    emoji: summary.emoji,
    amount: summary.amount,
    count: expenses.filter((expense) => expense.category === summary.category)
      .length,
  }));

  return {
    totalSpending: expenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    ),
    transactionCount: expenses.length,
    highestSpendingCategory: categorySummary[0]?.category ?? '-',
    categorySummary,
    categorySpending,
  };
}

export function getPieChartData(
  categorySummary: GroupedCategory[],
): PieChartSlice[] {
  return categorySummary.map((item, index) => ({
    name: item.category,
    population: item.amount,
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: '#F5F5F7',
    legendFontSize: 12,
  }));
}
