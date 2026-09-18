import { StyleSheet, Text, View } from 'react-native';

import { useAppSettings } from '../context/AppSettingsContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import type { CategoryCardProps } from '../types/expense';
import { CategoryIcon } from './CategoryIcon';

export function CategoryCard({ category }: CategoryCardProps) {
  const { formatMoney } = useAppSettings();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <CategoryIcon category={category.category} size={40} />
        <Text style={styles.name} numberOfLines={1}>
          {category.category}
        </Text>
      </View>
      <Text
        style={styles.amount}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >
        {formatMoney(category.amount)}
      </Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      minWidth: 0,
    },
    name: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      letterSpacing: -0.2,
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
