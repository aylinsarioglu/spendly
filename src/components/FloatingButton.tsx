import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import type { FloatingButtonProps } from '../types/expense';

/** FAB diameter — keep in sync with button styles. */
export const FAB_SIZE = 60;

/** Gap between FAB and screen edges (before safe-area insets). */
export const FAB_EDGE_GAP = 20;

/**
 * Scroll/content bottom inset so list items clear the floating FAB.
 * size + edge gap above FAB + edge gap below FAB zone.
 */
export const FAB_SCROLL_INSET = FAB_SIZE + FAB_EDGE_GAP * 2;

export function FloatingButton({ onPress }: FloatingButtonProps) {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  // Home sits above the tab bar; only add system insets (gesture/nav).
  // Keep FAB in the true lower-right corner — large bottom offsets push it
  // into the search/filter band when content is short.
  const bottom = FAB_EDGE_GAP + Math.max(insets.bottom, 0);
  const right = FAB_EDGE_GAP + Math.max(insets.right, 0);

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
