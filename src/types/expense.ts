import type { Dispatch, SetStateAction } from 'react';

export type Expense = {
  id: string;
  amount: number;
  category: string;
  emoji: string;
  note: string;
};

export type BalanceCardProps = {
  total: number;
  categoryCount: number;
  label?: string;
};

export type GroupedCategory = {
  category: string;
  emoji: string;
  amount: number;
};

export type CategoryCardProps = {
  category: GroupedCategory;
};

export type TransactionCardProps = {
  expense: Expense;
};

export type FloatingButtonProps = {
  onPress: () => void;
};

export type AddExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
};

export type DeleteConfirmModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onDelete: () => void;
};

export type HomeScreenProps = {
  expenses: Expense[];
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
};

export type StatisticsScreenProps = {
  expenses: Expense[];
};

export type CategorySpending = {
  category: string;
  emoji: string;
  amount: number;
  count: number;
};

export type ExpenseStatistics = {
  totalSpending: number;
  transactionCount: number;
  mostUsedCategory: string;
  categorySpending: CategorySpending[];
};

export type PieChartSlice = {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

export type AppNavigatorProps = {
  expenses: Expense[];
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
};

export type RootTabParamList = {
  Home: undefined;
  Statistics: undefined;
};
