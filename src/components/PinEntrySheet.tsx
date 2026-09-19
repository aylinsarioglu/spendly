import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppLock } from '../context/AppLockContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { ThemeColors } from '../theme/colors';
import { PIN_LENGTH } from '../utils/pinHash';
import { PinKeypad } from './PinKeypad';

export type PinEntryMode = 'create' | 'disable' | 'change';

type PinEntrySheetProps = {
  isOpen: boolean;
  mode: PinEntryMode;
  onClose: () => void;
  onSuccess: () => void;
  onFailure?: (message: string) => void;
};

type CreateStep = 'enter' | 'confirm';
type ChangeStep = 'current' | 'enter' | 'confirm';

function getCreateCopy(step: CreateStep) {
  if (step === 'enter') {
    return {
      title: 'PIN Oluştur',
      subtitle: '6 haneli bir PIN belirleyin',
    };
  }

  return {
    title: 'PIN Doğrula',
    subtitle: "PIN'i tekrar girin",
  };
}

function getChangeCopy(step: ChangeStep) {
  if (step === 'current') {
    return {
      title: 'PIN Değiştir',
      subtitle: "Mevcut PIN'inizi girin",
    };
  }

  if (step === 'enter') {
    return {
      title: 'Yeni PIN',
      subtitle: '6 haneli yeni PIN belirleyin',
    };
  }

  return {
    title: 'Yeni PIN Doğrula',
    subtitle: "Yeni PIN'i tekrar girin",
  };
}

export function PinEntrySheet({
  isOpen,
  mode,
  onClose,
  onSuccess,
  onFailure,
}: PinEntrySheetProps) {
  const styles = useThemedStyles(createStyles);
  const { enablePin, disablePin, changePin, verifyPin } = useAppLock();
  const [pin, setPin] = useState('');
  const [pendingPin, setPendingPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [createStep, setCreateStep] = useState<CreateStep>('enter');
  const [changeStep, setChangeStep] = useState<ChangeStep>('current');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setPendingPin('');
      setCurrentPin('');
      setCreateStep('enter');
      setChangeStep('current');
      setError(null);
      setBusy(false);
    }
  }, [isOpen]);

  const copy =
    mode === 'disable'
      ? {
          title: 'Kilidi Kapat',
          subtitle: "Mevcut PIN'inizi girin",
        }
      : mode === 'create'
        ? getCreateCopy(createStep)
        : getChangeCopy(changeStep);

  const finishWithError = (message: string) => {
    setPin('');
    setPendingPin('');
    setCurrentPin('');
    setCreateStep('enter');
    setChangeStep('current');
    setBusy(false);
    setError(null);
    onFailure?.(message);
    onClose();
  };

  const handleCreate = async (nextPin: string) => {
    if (createStep === 'enter') {
      setPendingPin(nextPin);
      setPin('');
      setCreateStep('confirm');
      setBusy(false);
      return;
    }

    if (nextPin !== pendingPin) {
      setPin('');
      setPendingPin('');
      setCreateStep('enter');
      setError("PIN'ler eşleşmiyor");
      setBusy(false);
      return;
    }

    const enabled = await enablePin(nextPin);

    if (!enabled) {
      finishWithError('Uygulama kilidi kaydedilemedi.');
      return;
    }

    setBusy(false);
    onSuccess();
    onClose();
  };

  const handleDisable = async (nextPin: string) => {
    const disabled = await disablePin(nextPin);

    if (!disabled) {
      setPin('');
      setError('PIN hatalı');
      setBusy(false);
      return;
    }

    setBusy(false);
    onSuccess();
    onClose();
  };

  const handleChange = async (nextPin: string) => {
    if (changeStep === 'current') {
      const matches = await verifyPin(nextPin);

      if (!matches) {
        setPin('');
        setError('PIN hatalı');
        setBusy(false);
        return;
      }

      setCurrentPin(nextPin);
      setPin('');
      setChangeStep('enter');
      setBusy(false);
      return;
    }

    if (changeStep === 'enter') {
      setPendingPin(nextPin);
      setPin('');
      setChangeStep('confirm');
      setBusy(false);
      return;
    }

    if (nextPin !== pendingPin) {
      setPin('');
      setPendingPin('');
      setChangeStep('enter');
      setError("PIN'ler eşleşmiyor");
      setBusy(false);
      return;
    }

    const changed = await changePin(currentPin, nextPin);

    if (!changed) {
      finishWithError('PIN değiştirilemedi.');
      return;
    }

    setBusy(false);
    onSuccess();
    onClose();
  };

  const submitPin = async (nextPin: string) => {
    setBusy(true);
    setError(null);

    if (mode === 'create') {
      await handleCreate(nextPin);
      return;
    }

    if (mode === 'disable') {
      await handleDisable(nextPin);
      return;
    }

    await handleChange(nextPin);
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
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            onPress={onClose}
            disabled={busy}
            style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="İptal"
          >
            <Text style={styles.cancelText}>İptal</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.copy}>
            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
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
    </Modal>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    cancelButton: {
      alignSelf: 'flex-start',
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    cancelText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.accent,
    },
    pressed: {
      opacity: 0.75,
    },
    content: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 24,
    },
    copy: {
      alignItems: 'center',
      gap: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textPrimary,
      letterSpacing: -0.4,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
}
