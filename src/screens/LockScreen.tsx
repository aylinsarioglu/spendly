import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PinKeypad } from '../components/PinKeypad';
import { APP_NAME } from '../constants/app';
import { useAppLock } from '../context/AppLockContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import { settingsIcons } from '../theme/icons';
import { PIN_LENGTH } from '../utils/pinHash';

const LOCK_BACKGROUND = '#0A0A0C';

export function LockScreen() {
  const styles = useThemedStyles(createStyles);
  const { verifyPin } = useAppLock();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submitPin = async (nextPin: string) => {
    setBusy(true);
    setError(null);

    const matches = await verifyPin(nextPin);

    if (!matches) {
      setPin('');
      setError('PIN hatalı');
      setBusy(false);
    }
  };

  const handleDigit = (digit: string) => {
    if (busy || pin.length >= PIN_LENGTH) {
      return;
    }

    const nextPin = `${pin}${digit}`;
    setPin(nextPin);
    setError(null);

    if (nextPin.length === PIN_LENGTH) {
      void submitPin(nextPin);
    }
  };

  const handleBackspace = () => {
    if (busy) {
      return;
    }

    setError(null);
    setPin((current) => current.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>{APP_NAME}</Text>
          <View style={styles.iconWrap}>
            <Ionicons name={settingsIcons.appLock} size={28} color="#6C5CE7" />
          </View>
          <Text style={styles.title}>Uygulamanın Kilidi</Text>
          <Text style={styles.subtitle}>6 haneli PIN'inizi girin</Text>
        </View>

        <PinKeypad
          length={pin.length}
          error={error}
          disabled={busy}
          onDigit={handleDigit}
          onBackspace={handleBackspace}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(_colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: LOCK_BACKGROUND,
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 36,
      paddingBottom: 24,
    },
    header: {
      alignItems: 'center',
      gap: 12,
    },
    brand: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.7,
      color: '#F5F5F7',
    },
    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(108, 92, 231, 0.15)',
      borderWidth: 1,
      borderColor: 'rgba(108, 92, 231, 0.28)',
      marginTop: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: '#F5F5F7',
      letterSpacing: -0.3,
      marginTop: 4,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '500',
      color: '#8E8E93',
    },
  });
}
