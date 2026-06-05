import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initialExpenses } from './src/data/mockData';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';
import type { Expense } from './src/types/expense';
import { loadExpenses, saveExpenses } from './src/utils/storage';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.card,
    border: colors.border,
    primary: colors.accent,
    text: colors.textPrimary,
  },
};

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator expenses={expenses} setExpenses={setExpenses} />
      </NavigationContainer>
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
});
