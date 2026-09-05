import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import type { FloatingButtonProps } from '../types/expense';

const FAB_SIZE = 60;
/** Horizontal gap from the screen edge (plus safe-area inset). */
const FAB_RIGHT_GAP = 20;
/**
 * Distance from the bottom of the Home screen content area.
 * High enough to clear search/filter when they sit near the fold,
 * while staying in the lower-right and above the tab bar (screen is already inset by the navigator).
 */
const FAB_BOTTOM_GAP = 88;

export function FloatingButton({ onPress }: FloatingButtonProps) {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const bottom = FAB_BOTTOM_GAP + Math.max(insets.bottom, 0);
  const right = FAB_RIGHT_GAP + Math.max(insets.right, 0);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { bottom, right },
        pressed && styles.buttonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Harcama ekle"
    >
      <Text style={styles.icon}>+</Text>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    button: {
      position: 'absolute',
      width: FAB_SIZE,
      height: FAB_SIZE,
      borderRadius: FAB_SIZE / 2,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 16,
      elevation: 10,
    },
    buttonPressed: {
      opacity: 0.88,
      transform: [{ scale: 0.96 }],
    },
    icon: {
      fontSize: 32,
      fontWeight: '300',
      color: '#F5F5F7',
      lineHeight: 34,
      marginTop: -2,
    },
  });
}
