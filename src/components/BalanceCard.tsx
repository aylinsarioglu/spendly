import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

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
  const { width } = useWindowDimensions();
  const amountSize = width < 360 ? 32 : width < 400 ? 36 : 40;

  return (
    <View style={styles.card}>
      <Text style={styles.period}>Bu Ay</Text>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[styles.amount, { fontSize: amountSize, lineHeight: amountSize + 8 }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.55}
      >
        {formatMoney(total)}
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{categoryCount} kategori</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      paddingVertical: 24,
      paddingHorizontal: 22,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
    },
    period: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.accent,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
      letterSpacing: 0.2,
    },
    amount: {
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -1.2,
      marginTop: 4,
    },
    badge: {
      alignSelf: 'flex-start',
      marginTop: 10,
      backgroundColor: colors.accentSoft,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(108, 92, 231, 0.28)',
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.accent,
    },
  });
}
