import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';

type MessageSheetProps = {
  isOpen: boolean;
  title: string;
  message: string;
  closeLabel?: string;
  onClose: () => void;
};

export function MessageSheet({
  isOpen,
  title,
  message,
  closeLabel = 'Kapat',
  onClose,
}: MessageSheetProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <Text style={styles.closeText}>{closeLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.overlay,
    },
    sheet: {
      backgroundColor: colors.cardElevated,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      borderWidth: 1,
      borderColor: colors.border,
      borderBottomWidth: 0,
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 32,
      gap: 10,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginBottom: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    message: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    closeButton: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      backgroundColor: colors.accent,
    },
    pressed: {
      opacity: 0.88,
    },
    closeText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#F5F5F7',
    },
  });
}
