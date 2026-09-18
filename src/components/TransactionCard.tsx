import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppSettings } from '../context/AppSettingsContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import type { TransactionCardProps } from '../types/expense';
import { formatExpenseDate, getSafeCreatedAt } from '../utils/date';
import { CategoryIcon } from './CategoryIcon';

export function TransactionCard({ expense, onPress }: TransactionCardProps) {
  const { formatMoney } = useAppSettings();
  const styles = useThemedStyles(createStyles);
  const note = expense.note.trim();
  const createdAtLabel = formatExpenseDate(getSafeCreatedAt(expense));

  return (
    <Pressable
      onPress={() => onPress?.(expense)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <CategoryIcon category={expense.category} size={40} />

      <View style={styles.content}>
        <Text style={styles.category} numberOfLines={1}>
          {expense.category}
        </Text>
        {note ? (
          <Text style={styles.note} numberOfLines={1}>
            {note}
          </Text>
        ) : null}
        <Text style={styles.date} numberOfLines={1}>
          {createdAtLabel}
        </Text>
      </View>

      <Text
        style={styles.amount}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {formatMoney(expense.amount)}
      </Text>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardPressed: {
      opacity: 0.88,
      backgroundColor: colors.cardElevated,
    },
    content: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    category: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
      letterSpacing: -0.2,
    },
    note: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    date: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.textMuted,
    },
    amount: {
      maxWidth: '42%',
      flexShrink: 0,
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.3,
      textAlign: 'right',
    },
  });
}
