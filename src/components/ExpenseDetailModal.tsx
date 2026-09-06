import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppSettings } from '../context/AppSettingsContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import type { ExpenseDetailModalProps } from '../types/expense';
import { formatExpenseFullDate, getSafeCreatedAt } from '../utils/date';

export function ExpenseDetailModal({
  visible,
  expense,
  onClose,
  onEdit,
  onDelete,
}: ExpenseDetailModalProps) {
  const { formatMoney } = useAppSettings();
  const styles = useThemedStyles(createStyles);
  const note = expense?.note.trim() || 'Not yok';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          {expense ? (
            <>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{expense.emoji}</Text>
              </View>

              <Text style={styles.title}>Harcama Detayı</Text>

              <View style={styles.details}>
                <DetailRow label="Kategori" value={expense.category} />
                <DetailRow
                  label="Tutar"
                  value={formatMoney(expense.amount)}
                  highlight
                />
                <DetailRow label="Not" value={note} />
                <DetailRow
                  label="Tarih"
                  value={formatExpenseFullDate(getSafeCreatedAt(expense))}
                />
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.closeButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.closeButtonText}>Kapat</Text>
                </Pressable>

                <Pressable
                  onPress={() => onEdit(expense)}
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.editButtonText}>Düzenle</Text>
                </Pressable>

                <Pressable
                  onPress={() => onDelete(expense.id)}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.deleteButtonText}>Sil</Text>
                </Pressable>
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

function DetailRow({ label, value, highlight = false }: DetailRowProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, highlight && styles.detailHighlight]}>
        {value}
      </Text>
    </View>
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
    gap: 20,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  emojiContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.input,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  emoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  details: {
    width: '100%',
    gap: 14,
  },
  detailRow: {
    backgroundColor: colors.input,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  detailValue: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  detailHighlight: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  closeButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  deleteButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.12)',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.danger,
  },
  });
}
