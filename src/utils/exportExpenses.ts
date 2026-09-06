import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import type { Expense } from '../types/expense';
import type { CurrencyCode } from '../types/settings';
import { formatCurrency } from './currency';
import { getSafeCreatedAt } from './date';

const CSV_HEADER = 'Date,Category,Amount,Note';

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

export function getExportFileName(now = new Date()): string {
  const year = now.getFullYear();
  const month = padDatePart(now.getMonth() + 1);
  const day = padDatePart(now.getDate());
  return `spendly-expenses-${year}-${month}-${day}.csv`;
}

export function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function formatCsvDate(createdAt: string): string {
  const parsed = new Date(createdAt);

  if (!createdAt || Number.isNaN(parsed.getTime())) {
    return '';
  }

  return `${parsed.getFullYear()}-${padDatePart(parsed.getMonth() + 1)}-${padDatePart(parsed.getDate())}`;
}

export function buildExpensesCsv(
  expenses: Expense[],
  currency: CurrencyCode,
): string {
  const rows = expenses.map((expense) => {
    const date = formatCsvDate(getSafeCreatedAt(expense));
    const amount = formatCurrency(expense.amount, currency);

    return [
      escapeCsvField(date),
      escapeCsvField(expense.category),
      escapeCsvField(amount),
      escapeCsvField(expense.note),
    ].join(',');
  });

  return `\uFEFF${[CSV_HEADER, ...rows].join('\n')}`;
}

function downloadCsvOnWeb(csv: string, filename: string): void {
  const webDocument = (globalThis as { document?: Document }).document;

  if (!webDocument) {
    throw new Error('CSV download is not available');
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = webDocument.createElement('a');
  link.href = url;
  link.download = filename;
  webDocument.body.appendChild(link);
  link.click();
  webDocument.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function shareCsvOnNative(csv: string, filename: string): Promise<void> {
  const file = new File(Paths.cache, filename);

  if (file.exists) {
    file.delete();
  }

  file.create();
  file.write(csv);

  const canShare = await Sharing.isAvailableAsync();

  if (!canShare) {
    throw new Error('Sharing is not available');
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/csv',
    dialogTitle: 'Harcamaları Dışa Aktar',
    UTI: 'public.comma-separated-values-text',
  });
}

export async function exportExpenses(
  expenses: Expense[],
  currency: CurrencyCode,
): Promise<void> {
  const csv = buildExpensesCsv(expenses, currency);
  const filename = getExportFileName();

  if (Platform.OS === 'web') {
    downloadCsvOnWeb(csv, filename);
    return;
  }

  await shareCsvOnNative(csv, filename);
}
