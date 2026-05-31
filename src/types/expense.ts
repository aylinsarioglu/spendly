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

export type CategoryCardProps = {
  expense: Expense;
  onLongPress?: (expense: Expense) => void;
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
