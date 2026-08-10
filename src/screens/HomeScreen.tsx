import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddExpenseModal } from '../components/AddExpenseModal';
import { BalanceCard } from '../components/BalanceCard';
import { CategoryCard } from '../components/CategoryCard';
import { ExpenseDetailModal } from '../components/ExpenseDetailModal';
import { FilterBottomSheet } from '../components/FilterBottomSheet';
import { FloatingButton } from '../components/FloatingButton';
import { SearchBar } from '../components/SearchBar';
import { TransactionCard } from '../components/TransactionCard';
import {
  defaultTransactionFilter,
  isDefaultTransactionFilter,
} from '../data/filterOptions';
import { colors } from '../theme/colors';
import type {
  Expense,
  HomeScreenProps,
  TransactionFilter,
} from '../types/expense';
import { getVisibleTransactions } from '../utils/filterExpenses';
import { groupExpensesByCategory } from '../utils/groupExpensesByCategory';

const UNDO_TIMEOUT_MS = 5000;

export function HomeScreen({ expenses, setExpenses }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(20, Math.min(32, width * 0.06));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [lastDeletedExpense, setLastDeletedExpense] = useState<Expense | null>(
    null,
  );
  const [lastDeletedIndex, setLastDeletedIndex] = useState<number | null>(null);
  const [appliedFilter, setAppliedFilter] = useState<TransactionFilter>(
    defaultTransactionFilter,
  );
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  const categoryCount = useMemo(
    () => new Set(expenses.map((expense) => expense.category)).size,
    [expenses],
  );

  const groupedCategories = useMemo(
    () => groupExpensesByCategory(expenses),
    [expenses],
  );

  const visibleTransactions = useMemo(
    () => getVisibleTransactions(expenses, appliedFilter, searchQuery),
    [expenses, appliedFilter, searchQuery],
  );

  const isFilterActive = !isDefaultTransactionFilter(appliedFilter);

  const clearUndoTimeout = () => {
    if (undoTimeoutRef.current !== null) {
      clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearUndoTimeout();
    };
  }, []);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleOpenCreate = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
    handleCloseForm();
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === updatedExpense.id ? updatedExpense : exp,
      ),
    );
    setIsFormOpen(false);
    setEditingExpense(null);
    setSelectedExpense(null);
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(null);
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    const deletedIndex = expenses.findIndex(
      (expense) => expense.id === expenseId,
    );
    const deletedExpense =
      deletedIndex >= 0 ? expenses[deletedIndex] : undefined;

    if (!deletedExpense) {
      return;
    }

    clearUndoTimeout();
    setLastDeletedExpense(deletedExpense);
    setLastDeletedIndex(deletedIndex);
    setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
    setSelectedExpense(null);

    undoTimeoutRef.current = setTimeout(() => {
      setLastDeletedExpense(null);
      setLastDeletedIndex(null);
      undoTimeoutRef.current = null;
    }, UNDO_TIMEOUT_MS);
  };

  const handleUndoDelete = () => {
    if (!lastDeletedExpense) {
      return;
    }

    clearUndoTimeout();

    const expenseToRestore = lastDeletedExpense;
    const insertIndex = lastDeletedIndex ?? 0;

    setExpenses((prev) => {
      const next = [...prev];
      const safeIndex = Math.min(Math.max(insertIndex, 0), next.length);
      next.splice(safeIndex, 0, expenseToRestore);
      return next;
    });

    setLastDeletedExpense(null);
    setLastDeletedIndex(null);
  };

  const handleApplyFilter = (filter: TransactionFilter) => {
    setAppliedFilter(filter);
  };

  const handleClearFilter = () => {
    setAppliedFilter(defaultTransactionFilter);
  };

  const renderTransactionsSection = () => {
    if (expenses.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>Henüz harcama yok</Text>
          <Text style={styles.emptyDescription}>
            İlk harcamanı eklemek için{'\n'}sağ alttaki + butonuna dokun.
          </Text>
        </View>
      );
    }

    if (visibleTransactions.length === 0) {
      return (
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No expenses found</Text>
            <Text style={styles.emptyDescription}>Try another keyword.</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View style={styles.categoryList}>
          {visibleTransactions.map((expense) => (
            <TransactionCard
              key={expense.id}
              expense={expense}
              onPress={setSelectedExpense}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.appTitle}>Spendly</Text>
          <Text style={styles.periodLabel}>Bu Ay</Text>
        </View>

        <BalanceCard total={total} categoryCount={categoryCount} />

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Category Summary</Text>
          <View style={styles.categoryList}>
            {groupedCategories.map((category) => (
              <CategoryCard key={category.category} category={category} />
            ))}
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBarWrap}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>

          <Pressable
            onPress={() => setIsFilterOpen(true)}
            style={({ pressed }) => [
              styles.filterButton,
              isFilterActive && styles.filterButtonActive,
              pressed && styles.filterButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Filtrele"
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={isFilterActive ? colors.accent : colors.textPrimary}
            />
            {isFilterActive ? <View style={styles.filterDot} /> : null}
          </Pressable>
        </View>

        {renderTransactionsSection()}
      </ScrollView>

      {lastDeletedExpense ? (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarMessage}>Expense deleted</Text>
          <Pressable
            onPress={handleUndoDelete}
            style={({ pressed }) => [
              styles.undoButton,
              pressed && styles.undoButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Undo delete"
          >
            <Text style={styles.undoButtonText}>UNDO</Text>
          </Pressable>
        </View>
      ) : null}

      <FloatingButton onPress={handleOpenCreate} />

      <AddExpenseModal
        isOpen={isFormOpen}
        editingExpense={editingExpense}
        onClose={handleCloseForm}
        onSave={handleAddExpense}
        onUpdate={handleUpdateExpense}
      />

      <ExpenseDetailModal
        visible={selectedExpense !== null}
        expense={selectedExpense}
        onClose={() => setSelectedExpense(null)}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        value={appliedFilter}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 100,
    gap: 28,
  },
  header: {
    gap: 6,
    marginTop: 8,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBarWrap: {
    flex: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  filterButtonPressed: {
    opacity: 0.88,
  },
  filterDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  categorySection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  categoryList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 48,
    paddingHorizontal: 28,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  snackbar: {
    position: 'absolute',
    left: 20,
    right: 96,
    bottom: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: colors.cardElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  snackbarMessage: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  undoButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  undoButtonPressed: {
    opacity: 0.75,
  },
  undoButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: colors.accent,
  },
});
