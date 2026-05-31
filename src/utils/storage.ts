import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Expense } from '../types/expense';

const STORAGE_KEY = 'expenses';

function isExpense(value: unknown): value is Expense {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const expense = value as Record<string, unknown>;

  return (
    typeof expense.id === 'string' &&
    typeof expense.amount === 'number' &&
    typeof expense.category === 'string' &&
    typeof expense.emoji === 'string' &&
    typeof expense.note === 'string'
  );
}

export async function saveExpenses(expenses: Expense[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export async function loadExpenses(): Promise<Expense[] | null> {
  const data = await AsyncStorage.getItem(STORAGE_KEY);

  if (!data) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(data);

    if (!Array.isArray(parsed) || !parsed.every(isExpense)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
