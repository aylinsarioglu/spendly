import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AboutSheet } from '../components/AboutSheet';
import { ConfirmSheet } from '../components/ConfirmSheet';
import { OptionPickerSheet } from '../components/OptionPickerSheet';
import { SettingsRow } from '../components/SettingsRow';
import { APP_VERSION } from '../constants/app';
import { useAppSettings } from '../context/AppSettingsContext';
import { currencyOptions } from '../utils/currency';
import { themeOptions } from '../data/settingsOptions';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import type { SettingsScreenProps } from '../types/expense';
import type { CurrencyCode, ThemeMode } from '../types/settings';

type Picker = 'none' | 'currency' | 'theme' | 'about';
type DeleteStep = 'none' | 'first' | 'second';

export function SettingsScreen({ onDeleteAllExpenses }: SettingsScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { currency, theme, setCurrency, setTheme } = useAppSettings();
  const [picker, setPicker] = useState<Picker>('none');
  const [deleteStep, setDeleteStep] = useState<DeleteStep>('none');

  const currencyLabel =
    currencyOptions.find((option) => option.code === currency)?.label ?? currency;
  const themeLabel =
    themeOptions.find((option) => option.value === theme)?.label ?? theme;

  const handleDeleteAll = () => {
    onDeleteAllExpenses();
    setDeleteStep('none');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Preferences and data</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>General</Text>
          <SettingsRow
            icon="cash-outline"
            title="Currency"
            description="Used across Home and Statistics"
            value={currencyLabel}
            onPress={() => setPicker('currency')}
          />
          <SettingsRow
            icon="moon-outline"
            title="Theme"
            description="Dark is the default Spendly look"
            value={themeLabel}
            onPress={() => setPicker('theme')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Data</Text>
          <SettingsRow
            icon="trash-outline"
            title="Delete All Expenses"
            description="Permanently remove every saved expense"
            destructive
            onPress={() => setDeleteStep('first')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <SettingsRow
            icon="information-circle-outline"
            title="App Version"
            description="Current Spendly build"
            value={APP_VERSION}
          />
          <SettingsRow
            icon="sparkles-outline"
            title="About Spendly"
            description="Personal expense tracker"
            onPress={() => setPicker('about')}
          />
        </View>
      </ScrollView>

      <OptionPickerSheet
        isOpen={picker === 'currency'}
        title="Currency"
        options={currencyOptions.map((option) => ({
          value: option.code,
          label: option.label,
        }))}
        selected={currency}
        onSelect={(value: CurrencyCode) => setCurrency(value)}
        onClose={() => setPicker('none')}
      />

      <OptionPickerSheet
        isOpen={picker === 'theme'}
        title="Theme"
        options={themeOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        selected={theme}
        onSelect={(value: ThemeMode) => setTheme(value)}
        onClose={() => setPicker('none')}
      />

      <ConfirmSheet
        isOpen={deleteStep === 'first'}
        title="Delete all expenses?"
        message="This will remove every expense from Home and Statistics."
        confirmLabel="Delete All"
        onClose={() => setDeleteStep('none')}
        onConfirm={() => setDeleteStep('second')}
      />

      <ConfirmSheet
        isOpen={deleteStep === 'second'}
        title="This cannot be undone"
        message="Are you sure you want to permanently delete all expenses?"
        confirmLabel="Delete All"
        onClose={() => setDeleteStep('none')}
        onConfirm={handleDeleteAll}
      />

      <AboutSheet
        isOpen={picker === 'about'}
        onClose={() => setPicker('none')}
      />
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 8,
      paddingBottom: 32,
      paddingHorizontal: 20,
      gap: 28,
    },
    header: {
      gap: 6,
      marginTop: 8,
    },
    title: {
      fontSize: 34,
      fontWeight: '700',
      letterSpacing: -0.5,
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textSecondary,
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
  });
}
