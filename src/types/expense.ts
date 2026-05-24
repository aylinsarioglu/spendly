export type ExpenseCategory = {
  id: string;
  emoji: string;
  name: string;
  amount: number;
};

export type ExpenseCategoryOption = {
  id: string;
  emoji: string;
  name: string;
};

export type NewExpense = {
  amount: number;
  categoryId: string;
  categoryName: string;
  note: string;
};

export type ExpenseFormState = {
  amount: string;
  categoryId: string;
  note: string;
};

export type BalanceCardProps = {
  amount: number;
  categoryCount: number;
  label?: string;
};

export type CategoryCardProps = {
  category: ExpenseCategory;
};

export type FloatingButtonProps = {
  onPress: () => void;
};

export type AddExpenseModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (expense: NewExpense) => void;
};
