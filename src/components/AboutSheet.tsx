import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { APP_NAME, APP_VERSION } from '../constants/app';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';

type AboutSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AboutSheet({ isOpen, onClose }: AboutSheetProps) {
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
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.tagline}>Kişisel harcama takip uygulaması</Text>
          <Text style={styles.version}>Sürüm {APP_VERSION}</Text>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <Text style={styles.closeText}>Kapat</Text>
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
      alignItems: 'center',
      gap: 8,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginBottom: 12,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.4,
    },
    tagline: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    version: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.accent,
      marginTop: 8,
      marginBottom: 12,
    },
    closeButton: {
      width: '100%',
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
