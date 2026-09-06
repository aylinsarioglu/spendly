import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppSettingsProvider, useAppSettings } from './src/context/AppSettingsContext';
import { initialExpenses } from './src/data/mockData';
import { AppNavigator } from './src/navigation/AppNavigator';
import type { ThemeColors } from './src/theme/colors';
import type { Expense } from './src/types/expense';
import { clearExpenses, loadExpenses, saveExpenses } from './src/utils/storage';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <AppContent />
      </AppSettingsProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { ready, colors, theme } = useAppSettings();
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

  const handleDeleteAllExpenses = () => {
    setExpenses([]);
    clearExpenses().catch((error) => {
      console.error('Failed to clear expenses:', error);
    });
  };

  const navigationTheme = {
    ...(theme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      border: colors.border,
      primary: colors.accent,
      text: colors.textPrimary,
    },
  };

  if (!ready || loading) {
    return (
      <>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <View style={createLoadingStyles(colors).loadingContainer}>
          <Text style={createLoadingStyles(colors).loadingText}>Yükleniyor...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator
          expenses={expenses}
          setExpenses={setExpenses}
          onDeleteAllExpenses={handleDeleteAllExpenses}
        />
      </NavigationContainer>
    </>
  );
}

function createLoadingStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
}
