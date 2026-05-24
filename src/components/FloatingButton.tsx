import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';
import type { FloatingButtonProps } from '../types/expense';

export function FloatingButton({ onPress }: FloatingButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      accessibilityRole="button"
      accessibilityLabel="Harcama ekle"
    >
      <Text style={styles.icon}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: colors.textPrimary,
    lineHeight: 34,
    marginTop: -2,
  },
});
