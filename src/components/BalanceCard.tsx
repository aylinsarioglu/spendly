import { StyleSheet, Text, View } from 'react-native';

import { useAppSettings } from '../context/AppSettingsContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import type { BalanceCardProps } from '../types/expense';

export function BalanceCard({
  total,
  categoryCount,
  label = 'Toplam Harcama',
}: BalanceCardProps) {
  const { formatMoney } = useAppSettings();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>{formatMoney(total)}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{categoryCount} kategori</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.cardElevated,
      borderRadius: 24,
      padding: 28,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    amount: {
      fontSize: 42,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -1,
    },
    badge: {
      alignSelf: 'flex-start',
      marginTop: 8,
      backgroundColor: colors.accentSoft,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    badgeText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.accent,
    },
  });
}
