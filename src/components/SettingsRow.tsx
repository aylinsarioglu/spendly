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
  showDivider?: boolean;
  onPress?: () => void;
};

export function SettingsRow({
  icon,
  title,
  description,
  value,
  destructive = false,
  showDivider = false,
  onPress,
}: SettingsRowProps) {
  const { colors } = useAppSettings();
  const styles = useThemedStyles(createStyles);
  const iconColor = destructive ? colors.danger : colors.accent;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        showDivider && styles.rowDivider,
        pressed && onPress && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, destructive && styles.iconWrapDanger]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, destructive && styles.titleDanger]}>
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.trailing}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        {onPress ? (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={destructive ? colors.danger : colors.textMuted}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingHorizontal: 18,
      paddingVertical: 16,
    },
    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pressed: {
      opacity: 0.88,
      backgroundColor: colors.cardElevated,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: colors.cardElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrapDanger: {
      backgroundColor: 'rgba(255, 107, 107, 0.12)',
    },
    content: {
      flex: 1,
      gap: 3,
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.textPrimary,
      letterSpacing: -0.2,
    },
    titleDanger: {
      color: colors.danger,
    },
    description: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
      lineHeight: 18,
    },
    trailing: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    value: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.accent,
    },
  });
}
