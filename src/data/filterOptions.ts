import type {
  DateFilterOption,
  FilterCategory,
  SortOption,
  TransactionFilter,
} from '../types/expense';

export const filterCategoryOptions: FilterCategory[] = [
  'Tümü',
  'Yemek',
  'Ulaşım',
  'Alışveriş',
];

export const dateFilterOptions: DateFilterOption[] = [
  'Tümü',
  'Bugün',
  'Dün',
  'Bu Hafta',
  'Bu Ay',
];

export const sortOptions: SortOption[] = [
  'En Yeni',
  'En Eski',
  'En Yüksek Tutar',
  'En Düşük Tutar',
];

export const defaultTransactionFilter: TransactionFilter = {
  category: 'Tümü',
  date: 'Tümü',
  sortBy: 'En Yeni',
};

export function isDefaultTransactionFilter(
  filter: TransactionFilter,
): boolean {
  return (
    filter.category === defaultTransactionFilter.category &&
    filter.date === defaultTransactionFilter.date &&
    filter.sortBy === defaultTransactionFilter.sortBy
  );
}

export function getActiveFilterCount(filter: TransactionFilter): number {
  let count = 0;

  if (filter.category !== defaultTransactionFilter.category) {
    count += 1;
  }

  if (filter.date !== defaultTransactionFilter.date) {
    count += 1;
  }

  return count;
}
