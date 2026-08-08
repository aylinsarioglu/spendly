import type {
  FilterCategory,
  SortOption,
  TransactionFilter,
} from '../types/expense';

export const filterCategoryOptions: FilterCategory[] = [
  'All',
  'Yemek',
  'Ulaşım',
  'Alışveriş',
];

export const sortOptions: SortOption[] = [
  'Newest',
  'Oldest',
  'Highest Amount',
  'Lowest Amount',
];

export const defaultTransactionFilter: TransactionFilter = {
  category: 'All',
  sortBy: 'Newest',
};

export function isDefaultTransactionFilter(
  filter: TransactionFilter,
): boolean {
  return (
    filter.category === defaultTransactionFilter.category &&
    filter.sortBy === defaultTransactionFilter.sortBy
  );
}
