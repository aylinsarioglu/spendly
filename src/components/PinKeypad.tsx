import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useAppSettings } from '../context/AppSettingsContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import { PIN_LENGTH } from '../utils/pinHash';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'] as const;

type PinKeypadProps = {
  length: number;
  error?: string | null;
  disabled?: boolean;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
};

export function PinKeypad({
  length,
  error,
  disabled = false,
  onDigit,
  onBackspace,
}: PinKeypadProps) {
  const { colors } = useAppSettings();
  const styles = useThemedStyles(createStyles);
  const { width } = useWindowDimensions();
  const keySize = Math.min(78, Math.max(64, (width - 72) / 3 - 10));

  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: PIN_LENGTH }, (_, index) => (
          <View
            key={index}
            style={[styles.dot, index < length && styles.dotFilled]}
          />
        ))}
      </View>

      <Text style={styles.error}>{error ?? ' '}</Text>

      <View style={styles.grid}>
        {KEYS.map((key) => {
          if (key === '') {
            return <View key="empty" style={{ width: keySize, height: keySize }} />;
          }

          if (key === 'back') {
            return (
              <Pressable
                key="back"
                disabled={disabled}
                onPress={onBackspace}
                accessibilityRole="button"
                accessibilityLabel="Sil"
                style={({ pressed }) => [
                  styles.key,
                  { width: keySize, height: keySize },
                  pressed && !disabled && styles.keyPressed,
                ]}
              >
                <Ionicons
                  name="backspace-outline"
                  size={26}
                  color={disabled ? colors.textMuted : colors.textPrimary}
                />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={key}
              disabled={disabled}
              onPress={() => onDigit(key)}
              accessibilityRole="button"
              accessibilityLabel={key}
              style={({ pressed }) => [
                styles.key,
                { width: keySize, height: keySize },
                pressed && !disabled && styles.keyPressed,
              ]}
            >
              <Text style={[styles.keyLabel, disabled && styles.keyLabelDisabled]}>
                {key}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      gap: 18,
    },
    dots: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
    },
    dot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: 'transparent',
    },
    dotFilled: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    error: {
      minHeight: 20,
      fontSize: 14,
      fontWeight: '600',
      color: colors.danger,
      textAlign: 'center',
    },
    grid: {
      width: '100%',
      maxWidth: 320,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
    },
    key: {
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    keyPressed: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.accent,
    },
    keyLabel: {
      fontSize: 26,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    keyLabelDisabled: {
      color: colors.textMuted,
    },
  });
}
