import type { IoniconName } from './icons';

export type CategoryVisual = {
  icon: IoniconName;
  iconColor: string;
  backgroundColor: string;
  borderColor: string;
  chartColor: string;
};

const DEFAULT_CATEGORY_VISUAL: CategoryVisual = {
  icon: 'pricetag-outline',
  iconColor: '#6C5CE7',
  backgroundColor: 'rgba(108, 92, 231, 0.16)',
  borderColor: 'rgba(108, 92, 231, 0.28)',
  chartColor: '#6C5CE7',
};

const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  Yemek: {
    icon: 'restaurant-outline',
    iconColor: '#F5A524',
    backgroundColor: 'rgba(245, 165, 36, 0.16)',
    borderColor: 'rgba(245, 165, 36, 0.28)',
    chartColor: '#F5A524',
  },
  Ulaşım: {
    icon: 'car-outline',
    iconColor: '#74B9FF',
    backgroundColor: 'rgba(116, 185, 255, 0.16)',
    borderColor: 'rgba(116, 185, 255, 0.28)',
    chartColor: '#74B9FF',
  },
  Alışveriş: {
    icon: 'bag-handle-outline',
    iconColor: '#FD79A8',
    backgroundColor: 'rgba(253, 121, 168, 0.16)',
    borderColor: 'rgba(253, 121, 168, 0.28)',
    chartColor: '#FD79A8',
  },
};

export function getCategoryVisual(category: string): CategoryVisual {
  return CATEGORY_VISUALS[category] ?? DEFAULT_CATEGORY_VISUAL;
}
