import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AboutSheet } from '../components/AboutSheet';
import { ConfirmSheet } from '../components/ConfirmSheet';
import { MessageSheet } from '../components/MessageSheet';
import { OptionPickerSheet } from '../components/OptionPickerSheet';
import { SettingsRow } from '../components/SettingsRow';
import { APP_VERSION } from '../constants/app';
import { useAppSettings } from '../context/AppSettingsContext';
import { themeOptions } from '../data/settingsOptions';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import type { SettingsScreenProps } from '../types/expense';
import type { CurrencyCode, ThemeMode } from '../types/settings';
import { currencyOptions } from '../utils/currency';
import { exportExpenses } from '../utils/exportExpenses';

type Picker = 'none' | 'currency' | 'theme' | 'about';
type DeleteStep = 'none' | 'first' | 'second';

function isShareCancelled(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  return message.includes('cancel') || message.includes('dismiss');
}

type Feedback = {
  title: string;
  message: string;
} | null;

export function SettingsScreen({
  expenses,
  onDeleteAllExpenses,
}: SettingsScreenProps) {
  const styles = useThemedStyles(createStyles);
  const { width } = useWindowDimensions();
  const { currency, theme, setCurrency, setTheme } = useAppSettings();
  const [picker, setPicker] = useState<Picker>('none');
  const [deleteStep, setDeleteStep] = useState<DeleteStep>('none');
  const [feedback, setFeedback] = useState<Feedback>(null);

  const horizontalPadding = Math.max(20, Math.min(32, width * 0.06));
  const contentWidth = Math.min(width - horizontalPadding * 2, 560);

  const currencyLabel =
    currencyOptions.find((option) => option.code === currency)?.label ?? currency;
  const themeLabel =
    themeOptions.find((option) => option.value === theme)?.label ?? theme;

  const handleDeleteAll = () => {
    onDeleteAllExpenses();
    setDeleteStep('none');
  };

  const handleExportExpenses = async () => {
    if (expenses.length === 0) {
      setFeedback({
        title: 'Dışa Aktarma',
        message: 'Dışa aktarılacak harcama bulunmuyor.',
      });
      return;
    }

    try {
      await exportExpenses(expenses, currency);
      setFeedback({
        title: 'Dışa Aktarma',
        message: 'Harcamalar başarıyla dışa aktarıldı.',
      });
    } catch (error) {
      if (isShareCancelled(error)) {
        return;
      }

      setFeedback({
        title: 'Dışa Aktarma',
        message: 'Harcamalar dışa aktarılamadı.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
            alignItems: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, { width: contentWidth }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Ayarlar</Text>
            <Text style={styles.subtitle}>Tercihler ve uygulama verileri</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>GENEL</Text>
            <View style={styles.sectionCard}>
              <SettingsRow
                icon="cash-outline"
                title="Para Birimi"
                description="Ana Sayfa ve İstatistikler'de kullanılır"
                value={currencyLabel}
                showDivider
                onPress={() => setPicker('currency')}
              />
              <SettingsRow
                icon="moon-outline"
                title="Tema"
                description="Spendly görünümünü değiştir"
                value={themeLabel}
                onPress={() => setPicker('theme')}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>VERİLER</Text>
            <View style={styles.sectionCard}>
              <SettingsRow
                icon="download-outline"
                title="Harcamaları Dışa Aktar"
                description="Tüm harcamaları CSV olarak dışa aktar"
                showDivider
                onPress={() => {
                  void handleExportExpenses();
                }}
              />
              <SettingsRow
                icon="trash-outline"
                title="Tüm Harcamaları Sil"
                description="Kaydedilen tüm harcamaları kalıcı olarak sil"
                destructive
                onPress={() => setDeleteStep('first')}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>HAKKINDA</Text>
            <View style={styles.sectionCard}>
              <SettingsRow
                icon="information-circle-outline"
                title="Uygulama Sürümü"
                description="Mevcut Spendly sürümü"
                value={APP_VERSION}
                showDivider
              />
              <SettingsRow
                icon="sparkles-outline"
                title="Spendly Hakkında"
                description="Kişisel harcama takip uygulaması"
                onPress={() => setPicker('about')}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <OptionPickerSheet
        isOpen={picker === 'currency'}
        title="Para Birimi"
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
        title="Tema"
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
        title="Tüm harcamalar silinsin mi?"
        message="Bu işlem Ana Sayfa ve İstatistikler'deki tüm harcamaları kaldırır."
        confirmLabel="Tümünü Sil"
        cancelLabel="İptal"
        onClose={() => setDeleteStep('none')}
        onConfirm={() => setDeleteStep('second')}
      />

      <ConfirmSheet
        isOpen={deleteStep === 'second'}
        title="Bu işlem geri alınamaz"
        message="Tüm harcamaları kalıcı olarak silmek istediğinize emin misiniz?"
        confirmLabel="Tümünü Sil"
        cancelLabel="İptal"
        onClose={() => setDeleteStep('none')}
        onConfirm={handleDeleteAll}
      />

      <AboutSheet
        isOpen={picker === 'about'}
        onClose={() => setPicker('none')}
      />

      <MessageSheet
        isOpen={feedback !== null}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        closeLabel="Kapat"
        onClose={() => setFeedback(null)}
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
    },
    content: {
      gap: 24,
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
      letterSpacing: 0.2,
    },
    section: {
      gap: 12,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
      letterSpacing: 0.8,
      paddingHorizontal: 4,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
  });
}
