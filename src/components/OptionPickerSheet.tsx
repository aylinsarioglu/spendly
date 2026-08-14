import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';

type OptionItem<T extends string> = {
  value: T;
  label: string;
};

type OptionPickerSheetProps<T extends string> = {
  isOpen: boolean;
  title: string;
  options: OptionItem<T>[];
  selected: T;
  onSelect: (value: T) => void;
  onClose: () => void;
};

export function OptionPickerSheet<T extends string>({
  isOpen,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: OptionPickerSheetProps<T>) {
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

          <View style={styles.list}>
            {options.map((option) => {
              const isSelected = option.value === selected;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  style={[styles.option, isSelected && styles.optionSelected]}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
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
      gap: 18,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.3,
    },
    list: {
      gap: 10,
    },
    option: {
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionSelected: {
      backgroundColor: colors.accentSoft,
      borderColor: colors.accent,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    optionLabelSelected: {
      color: colors.accent,
    },
  });
}
