import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import type { TransactionCardProps } from '../types/expense';
import { formatCurrency } from '../utils/formatCurrency';

export function TransactionCard({ expense }: TransactionCardProps) {
  const note = expense.note.trim() || '—';

  return (
    <View style={styles.card}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{expense.emoji}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.category}>{expense.category}</Text>
        <Text style={styles.note} numberOfLines={1}>
          {note}
        </Text>
      </View>

      <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
});
