import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
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
import { TransactionCard } from '../components/TransactionCard';
import { defaultTransactionFilter } from '../data/filterOptions';
import { colors } from '../theme/colors';
import type {
  Expense,
  HomeScreenProps,
  TransactionFilter,
} from '../types/expense';
import { filterAndSortExpenses } from '../utils/filterExpenses';
import { groupExpensesByCategory } from '../utils/groupExpensesByCategory';

export function HomeScreen({ expenses, setExpenses }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(20, Math.min(32, width * 0.06));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [appliedFilter, setAppliedFilter] = useState<TransactionFilter>(
    defaultTransactionFilter,
  );

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

  const filteredTransactions = useMemo(
    () => filterAndSortExpenses(expenses, appliedFilter),
    [expenses, appliedFilter],
  );

  const isFilterActive =
    appliedFilter.category !== defaultTransactionFilter.category ||
    appliedFilter.sortBy !== defaultTransactionFilter.sortBy;

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
    setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
    setSelectedExpense(null);
  };

  const handleApplyFilter = (filter: TransactionFilter) => {
    setAppliedFilter(filter);
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.appTitle}>Spendly</Text>
            <Text style={styles.periodLabel}>Bu Ay</Text>
          </View>

          <Pressable
            onPress={() => setIsFilterOpen(true)}
            style={({ pressed }) => [
              styles.filterButton,
              pressed && styles.filterButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Filtrele"
          >
            <Ionicons
              name="options-outline"
              size={22}
              color={isFilterActive ? colors.accent : colors.textPrimary}
            />
            {isFilterActive ? <View style={styles.filterDot} /> : null}
          </Pressable>
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

        {expenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>Henüz harcama yok</Text>
            <Text style={styles.emptyDescription}>
              İlk harcamanı eklemek için{'\n'}sağ alttaki + butonuna dokun.
            </Text>
          </View>
        ) : (
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {filteredTransactions.length > 0 ? (
              <View style={styles.categoryList}>
                {filteredTransactions.map((expense) => (
                  <TransactionCard
                    key={expense.id}
                    expense={expense}
                    onPress={setSelectedExpense}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.filterEmptyState}>
                <Text style={styles.filterEmptyText}>
                  Bu filtreye uygun harcama yok
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 16,
  },
  headerText: {
    flex: 1,
    gap: 6,
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
  filterEmptyState: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  filterEmptyText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
