import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  dateFilterOptions,
  defaultTransactionFilter,
  filterCategoryOptions,
  sortOptions,
} from '../data/filterOptions';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import type {
  FilterBottomSheetProps,
  TransactionFilter,
} from '../types/expense';

export function FilterBottomSheet({
  isOpen,
  onClose,
  value,
  onApply,
  onClear,
}: FilterBottomSheetProps) {
  const [draft, setDraft] = useState<TransactionFilter>(value);
  const styles = useThemedStyles(createStyles);

  useEffect(() => {
    if (isOpen) {
      setDraft(value);
    }
  }, [isOpen, value]);

  const handleClear = () => {
    setDraft(defaultTransactionFilter);
    onClear();
    onClose();
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

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

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Filtrele</Text>
              <Text style={styles.subtitle}>
                İşlemleri kategori, tarih ve sıralamaya göre daralt
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Kategori</Text>
              <View style={styles.chipRow}>
                {filterCategoryOptions.map((category) => (
                  <OptionChip
                    key={category}
                    label={category}
                    selected={draft.category === category}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        category,
                      }))
                    }
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Tarih</Text>
              <View style={styles.chipRow}>
                {dateFilterOptions.map((date) => (
                  <OptionChip
                    key={date}
                    label={date}
                    selected={draft.date === date}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        date,
                      }))
                    }
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Sıralama</Text>
              <View style={styles.chipRow}>
                {sortOptions.map((sortBy) => (
                  <OptionChip
                    key={sortBy}
                    label={sortBy}
                    selected={draft.sortBy === sortBy}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        sortBy,
                      }))
                    }
                  />
                ))}
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={handleClear}
                style={({ pressed }) => [
                  styles.clearButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.clearButtonText}>Temizle</Text>
              </Pressable>

              <Pressable
                onPress={handleApply}
                style={({ pressed }) => [
                  styles.applyButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.applyButtonText}>Uygula</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

type OptionChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function OptionChip({ label, selected, onPress }: OptionChipProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
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
    maxHeight: '78%',
    paddingBottom: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: 12,
    marginBottom: 4,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 24,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.accent,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  clearButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  applyButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F5F5F7',
  },
  });
}
