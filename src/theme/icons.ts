import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export const tabIcons = {
  home: {
    outline: 'home-outline',
    filled: 'home',
  },
  statistics: {
    outline: 'bar-chart-outline',
    filled: 'bar-chart',
  },
  settings: {
    outline: 'settings-outline',
    filled: 'settings',
  },
} as const satisfies Record<
  string,
  { outline: IoniconName; filled: IoniconName }
>;

export const settingsIcons = {
  currency: 'cash-outline',
  theme: 'moon-outline',
  appLock: 'lock-closed-outline',
  biometrics: 'finger-print-outline',
  changePin: 'key-outline',
  export: 'download-outline',
  deleteAll: 'trash-outline',
  version: 'information-circle-outline',
  about: 'sparkles-outline',
} as const satisfies Record<string, IoniconName>;
