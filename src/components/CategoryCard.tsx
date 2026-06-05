import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import type { CategoryCardProps } from '../types/expense';
import { formatCurrency } from '../utils/formatCurrency';

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{category.emoji}</Text>
        </View>
        <Text style={styles.name}>{category.category}</Text>
      </View>
      <Text style={styles.amount}>{formatCurrency(category.amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  amount: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
});
