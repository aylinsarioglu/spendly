import type { DateFilterOption } from '../types/expense';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const RELATIVE_DAY_LIMIT = 7;

type ExpenseDateSource = {
  id?: string;
  createdAt?: string | null;
};

function parseExpenseDate(dateString: string): Date | null {
  if (!dateString.trim()) {
    return null;
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getLocalDayDiff(from: Date, to: Date): number {
  return Math.round(
    (startOfLocalDay(to).getTime() - startOfLocalDay(from).getTime()) /
      DAY_IN_MS,
  );
}

export function getSafeCreatedAt(expense: ExpenseDateSource): string {
  if (typeof expense.createdAt === 'string') {
    const parsed = parseExpenseDate(expense.createdAt);

    if (parsed) {
      return expense.createdAt;
    }
  }

  if (typeof expense.id === 'string') {
    const timestamp = Number(expense.id);

    if (Number.isFinite(timestamp) && timestamp > 1_000_000_000_000) {
      return new Date(timestamp).toISOString();
    }
  }

  return '';
}

export function formatExpenseFullDate(dateString: string): string {
  const date = parseExpenseDate(dateString);

  if (!date) {
    return '-';
  }

  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatExpenseDate(dateString: string): string {
  const date = parseExpenseDate(dateString);

  if (!date) {
    return '-';
  }

  const diffDays = getLocalDayDiff(date, new Date());

  if (diffDays === 0) {
    return 'Bugün';
  }

  if (diffDays === 1) {
    return 'Dün';
  }

  if (diffDays > 1 && diffDays <= RELATIVE_DAY_LIMIT) {
    return `${diffDays} gün önce`;
  }

  return formatExpenseFullDate(dateString);
}

export function isToday(dateString: string, now = new Date()): boolean {
  const date = parseExpenseDate(dateString);
  return date ? getLocalDayDiff(date, now) === 0 : false;
}

export function isYesterday(dateString: string, now = new Date()): boolean {
  const date = parseExpenseDate(dateString);
  return date ? getLocalDayDiff(date, now) === 1 : false;
}

function startOfLocalWeek(date: Date): Date {
  const start = startOfLocalDay(date);
  const weekday = start.getDay();
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  start.setDate(start.getDate() - daysFromMonday);
  return start;
}

export function isThisWeek(dateString: string, now = new Date()): boolean {
  const date = parseExpenseDate(dateString);

  if (!date) {
    return false;
  }

  const weekStart = startOfLocalWeek(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const expenseDay = startOfLocalDay(date).getTime();

  return expenseDay >= weekStart.getTime() && expenseDay < weekEnd.getTime();
}

export function isThisMonth(dateString: string, now = new Date()): boolean {
  const date = parseExpenseDate(dateString);

  if (!date) {
    return false;
  }

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export function isExpenseInCurrentMonth(
  dateString: string,
  now = new Date(),
): boolean {
  return isThisMonth(dateString, now);
}

export function matchesDateFilter(
  dateString: string,
  dateFilter: DateFilterOption,
  now = new Date(),
): boolean {
  if (dateFilter === 'Tümü') {
    return true;
  }

  switch (dateFilter) {
    case 'Bugün':
      return isToday(dateString, now);
    case 'Dün':
      return isYesterday(dateString, now);
    case 'Bu Hafta':
      return isThisWeek(dateString, now);
    case 'Bu Ay':
      return isThisMonth(dateString, now);
    default:
      return true;
  }
}

export function getExpenseCreatedAtTime(dateString: string): number {
  const date = parseExpenseDate(dateString);
  return date?.getTime() ?? 0;
}

export function getExpensesInCurrentMonth<T extends ExpenseDateSource>(
  expenses: T[],
  now = new Date(),
): T[] {
  return expenses.filter((expense) =>
    isExpenseInCurrentMonth(getSafeCreatedAt(expense), now),
  );
}
