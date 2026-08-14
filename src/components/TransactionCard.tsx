import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppSettings } from '../context/AppSettingsContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import type { TransactionCardProps } from '../types/expense';
import { formatExpenseDate, getSafeCreatedAt } from '../utils/date';

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
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{expense.emoji}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.category}>{expense.category}</Text>
        {note ? (
          <Text style={styles.note} numberOfLines={1}>
            {note}
          </Text>
        ) : null}
        <Text style={styles.date}>{createdAtLabel}</Text>
      </View>

      <Text style={styles.amount}>{formatMoney(expense.amount)}</Text>
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
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardPressed: {
      opacity: 0.88,
      backgroundColor: colors.cardElevated,
    },
    emojiContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.cardElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emoji: {
      fontSize: 20,
    },
    content: {
      flex: 1,
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
      color: colors.textSecondary,
    },
    date: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.textMuted,
    },
    amount: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.2,
    },
  });
}
