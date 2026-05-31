export type CategoryOption = {
  name: string;
  emoji: string;
};

export const categoryOptions: CategoryOption[] = [
  { name: 'Yemek', emoji: '🍔' },
  { name: 'Ulaşım', emoji: '🚕' },
  { name: 'Alışveriş', emoji: '🛍️' },
];

export const defaultCategory = categoryOptions[0]?.name ?? 'Yemek';
