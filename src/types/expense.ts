import type { Dispatch, SetStateAction } from 'react';

export type Expense = {
  id: string;
  amount: number;
  category: string;
  emoji: string;
  note: string;
  createdAt: string;
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
  onPress?: (expense: Expense) => void;
};

export type ExpenseDetailModalProps = {
  visible: boolean;
  expense?: Expense | null;
  onClose: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
};

export type FloatingButtonProps = {
  onPress: () => void;
};

export type AddExpenseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
  onUpdate: (expense: Expense) => void;
  editingExpense?: Expense | null;
};

export type FilterCategory = 'Tümü' | 'Yemek' | 'Ulaşım' | 'Alışveriş';

export type SortOption =
  | 'En Yeni'
  | 'En Eski'
  | 'En Yüksek Tutar'
  | 'En Düşük Tutar';

export type TransactionFilter = {
  category: FilterCategory;
  sortBy: SortOption;
};

export type FilterBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  value: TransactionFilter;
  onApply: (filter: TransactionFilter) => void;
  onClear: () => void;
};

export type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
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
  averageSpending: number;
  highestSpendingCategory: string;
  highestSpendingCategoryEmoji: string;
  categorySummary: GroupedCategory[];
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
