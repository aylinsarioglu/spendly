import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import type { BalanceCardProps } from '../types/expense';
import { formatCurrency } from '../utils/formatCurrency';

export function BalanceCard({
  total,
  categoryCount,
  label = 'Toplam Harcama',
}: BalanceCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>{formatCurrency(total)}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{categoryCount} kategori</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
