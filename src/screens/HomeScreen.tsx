import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
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
import { FloatingButton } from '../components/FloatingButton';
import { TransactionCard } from '../components/TransactionCard';
import { colors } from '../theme/colors';
import type { Expense, HomeScreenProps } from '../types/expense';
import { groupExpensesByCategory } from '../utils/groupExpensesByCategory';

export function HomeScreen({ expenses, setExpenses }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(20, Math.min(32, width * 0.06));
  const [isOpen, setIsOpen] = useState(false);

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

  const recentTransactions = useMemo(() => expenses.slice(0, 5), [expenses]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
    setIsOpen(false);
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
          <Text style={styles.appTitle}>Spendly</Text>
          <Text style={styles.periodLabel}>Bu Ay</Text>
        </View>

        <BalanceCard total={total} categoryCount={categoryCount} />

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Kategoriler</Text>
          <View style={styles.categoryList}>
            {groupedCategories.map((category) => (
              <CategoryCard key={category.category} category={category} />
            ))}
          </View>
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.categoryList}>
            {recentTransactions.map((expense) => (
              <TransactionCard key={expense.id} expense={expense} />
            ))}
          </View>
        </View>
      </ScrollView>

      <FloatingButton onPress={() => setIsOpen(true)} />

      <AddExpenseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleAddExpense}
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
});
