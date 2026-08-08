import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Expense } from '../types/expense';

const STORAGE_KEY = 'expenses';

function resolveCreatedAt(expense: Record<string, unknown>): string {
  if (
    typeof expense.createdAt === 'string' &&
    !Number.isNaN(Date.parse(expense.createdAt))
  ) {
    return expense.createdAt;
  }

  if (typeof expense.id === 'string') {
    const timestamp = Number(expense.id);

    if (Number.isFinite(timestamp) && timestamp > 1_000_000_000_000) {
      return new Date(timestamp).toISOString();
    }
  }

  return new Date().toISOString();
}

function normalizeExpense(value: unknown): Expense | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const expense = value as Record<string, unknown>;

  if (
    typeof expense.id !== 'string' ||
    typeof expense.amount !== 'number' ||
    typeof expense.category !== 'string' ||
    typeof expense.emoji !== 'string' ||
    typeof expense.note !== 'string'
  ) {
    return null;
  }

  return {
    id: expense.id,
    amount: expense.amount,
    category: expense.category,
    emoji: expense.emoji,
    note: expense.note,
    createdAt: resolveCreatedAt(expense),
  };
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

    if (!Array.isArray(parsed)) {
      return null;
    }

    const expenses = parsed
      .map(normalizeExpense)
      .filter((expense): expense is Expense => expense !== null);

    return expenses.length === parsed.length ? expenses : null;
  } catch {
    return null;
  }
}
