import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppSplash } from './src/components/AppSplash';
import { AppLockProvider, useAppLock } from './src/context/AppLockContext';
import { AppSettingsProvider, useAppSettings } from './src/context/AppSettingsContext';
import { initialExpenses } from './src/data/mockData';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LockScreen } from './src/screens/LockScreen';
import type { Expense } from './src/types/expense';
import { clearExpenses, loadExpenses, saveExpenses } from './src/utils/storage';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <AppLockProvider>
          <AppContent />
        </AppLockProvider>
      </AppSettingsProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { ready, colors, theme } = useAppSettings();
  const { ready: lockReady, enabled, isLocked } = useAppLock();
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

  if (!ready || loading || !lockReady) {
    return (
      <>
        <StatusBar style="light" />
        <AppSplash />
      </>
    );
  }

  if (enabled && isLocked) {
    return <LockScreen />;
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
