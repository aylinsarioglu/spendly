import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { AddExpenseModal } from '../components/AddExpenseModal';
import { BalanceCard } from '../components/BalanceCard';
import { CategoryCard } from '../components/CategoryCard';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { FloatingButton } from '../components/FloatingButton';
import { initialExpenses } from '../data/mockData';
import { colors } from '../theme/colors';
import type { Expense } from '../types/expense';
import { loadExpenses, saveExpenses } from '../utils/storage';

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(20, Math.min(32, width * 0.06));
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  useEffect(() => {
    let isMounted = true;

    const hydrateExpenses = async () => {
      const storageData = await loadExpenses();

      if (isMounted) {
        setExpenses(storageData ?? initialExpenses);
        setLoading(false);
      }
    };

    hydrateExpenses();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    saveExpenses(expenses).catch((error) => {
      console.error('Failed to save expenses:', error);
    });
  }, [expenses, loading]);

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  const categoryCount = useMemo(
    () => new Set(expenses.map((expense) => expense.category)).size,
    [expenses],
  );

  const handleAddExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
    setIsOpen(false);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId));
    setExpenseToDelete(null);
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
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
            <Text style={styles.sectionTitle}>Harcamalar</Text>
            <View style={styles.categoryList}>
              {expenses.map((expense) => (
                <CategoryCard
                  key={expense.id}
                  expense={expense}
                  onLongPress={setExpenseToDelete}
                />
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

        <DeleteConfirmModal
          isOpen={expenseToDelete !== null}
          onCancel={() => setExpenseToDelete(null)}
          onDelete={() => {
            if (expenseToDelete) {
              handleDeleteExpense(expenseToDelete.id);
            }
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
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
