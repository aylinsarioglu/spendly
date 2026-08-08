import type {
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

export const sortOptions: SortOption[] = [
  'En Yeni',
  'En Eski',
  'En Yüksek Tutar',
  'En Düşük Tutar',
];

export const defaultTransactionFilter: TransactionFilter = {
  category: 'Tümü',
  sortBy: 'En Yeni',
};
