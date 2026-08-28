import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';

type ConfirmSheetProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmSheet({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'İptal',
  onConfirm,
  onClose,
}: ConfirmSheetProps) {
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

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
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
      gap: 12,
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
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 12,
    },
    cancelButton: {
      flex: 1,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
    },
    confirmButton: {
      flex: 1,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      backgroundColor: 'rgba(255, 107, 107, 0.12)',
      borderWidth: 1,
      borderColor: colors.danger,
    },
    pressed: {
      opacity: 0.88,
    },
    cancelText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    confirmText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.danger,
    },
  });
}
