import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppSettings } from '../context/AppSettingsContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';

type SettingsRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  value?: string;
  destructive?: boolean;
  onPress?: () => void;
};

export function SettingsRow({
  icon,
  title,
  description,
  value,
  destructive = false,
  onPress,
}: SettingsRowProps) {
  const { colors } = useAppSettings();
  const styles = useThemedStyles(createStyles);
  const iconColor = destructive ? colors.danger : colors.accent;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}
    >
      <View style={[styles.iconWrap, destructive && styles.iconWrapDanger]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, destructive && styles.titleDanger]}>
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {value ? <Text style={styles.value}>{value}</Text> : null}

      {onPress ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={destructive ? colors.danger : colors.textMuted}
        />
      ) : null}
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pressed: {
      opacity: 0.88,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrapDanger: {
      backgroundColor: 'rgba(255, 107, 107, 0.12)',
    },
    content: {
      flex: 1,
      gap: 2,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    titleDanger: {
      color: colors.danger,
    },
    description: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    value: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.accent,
    },
  });
}
