import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import {
  clearPinHash,
  getPinHash,
  isAppLockStorageAvailable,
  setPinHash,
} from '../utils/appLockStorage';
import {
  createSalt,
  hashPin,
  isValidPin,
  verifyPinHash,
} from '../utils/pinHash';

type AppLockContextValue = {
  ready: boolean;
  available: boolean;
  enabled: boolean;
  isLocked: boolean;
  enablePin: (pin: string) => Promise<boolean>;
  disablePin: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  changePin: (currentPin: string, newPin: string) => Promise<boolean>;
  lock: () => void;
};

const AppLockContext = createContext<AppLockContextValue | null>(null);

async function matchesStoredPin(pin: string): Promise<boolean> {
  if (!isValidPin(pin)) {
    return false;
  }

  const record = await getPinHash();

  if (!record) {
    return false;
  }

  return verifyPinHash(pin, record.salt, record.hash);
}

export function AppLockProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const enabledRef = useRef(false);
  const hasBecomeActiveRef = useRef(false);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    let isMounted = true;

    const hydrateLock = async () => {
      const storageAvailable = await isAppLockStorageAvailable();
      const pinExists = storageAvailable ? await getPinHash() : null;

      if (isMounted) {
        setAvailable(storageAvailable);
        setEnabled(pinExists !== null);
        setIsLocked(pinExists !== null);
        setReady(true);
      }
    };

    hydrateLock();

    return () => {
      isMounted = false;
    };
  }, []);

  const lock = useCallback(() => {
    if (!enabledRef.current) {
      return;
    }

    setIsLocked(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    hasBecomeActiveRef.current = AppState.currentState === 'active';

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        hasBecomeActiveRef.current = true;
        return;
      }

      if (!hasBecomeActiveRef.current || !enabledRef.current) {
        return;
      }

      if (nextState === 'inactive' || nextState === 'background') {
        lock();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [lock, ready]);

  const enablePin = useCallback(async (pin: string): Promise<boolean> => {
    if (!isValidPin(pin)) {
      return false;
    }

    try {
      const salt = await createSalt();
      const hash = await hashPin(pin, salt);
      await setPinHash({ version: 1, salt, hash });
      setEnabled(true);
      setIsLocked(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  const disablePin = useCallback(async (pin: string): Promise<boolean> => {
    const matches = await matchesStoredPin(pin);

    if (!matches) {
      return false;
    }

    try {
      await clearPinHash();
      setEnabled(false);
      setIsLocked(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    const matches = await matchesStoredPin(pin);

    if (matches) {
      setIsLocked(false);
    }

    return matches;
  }, []);

  const changePin = useCallback(
    async (currentPin: string, newPin: string): Promise<boolean> => {
      if (!isValidPin(newPin)) {
        return false;
      }

      const matches = await matchesStoredPin(currentPin);

      if (!matches) {
        return false;
      }

      try {
        const salt = await createSalt();
        const hash = await hashPin(newPin, salt);
        await setPinHash({ version: 1, salt, hash });
        setIsLocked(false);
        return true;
      } catch {
        return false;
      }
    },
    [],
  );

  const value = useMemo<AppLockContextValue>(
    () => ({
      ready,
      available,
      enabled,
      isLocked,
      enablePin,
      disablePin,
      verifyPin,
      changePin,
      lock,
    }),
    [
      ready,
      available,
      enabled,
      isLocked,
      enablePin,
      disablePin,
      verifyPin,
      changePin,
      lock,
    ],
  );

  return (
    <AppLockContext.Provider value={value}>{children}</AppLockContext.Provider>
  );
}

export function useAppLock(): AppLockContextValue {
  const context = useContext(AppLockContext);

  if (!context) {
    throw new Error('useAppLock must be used within AppLockProvider');
  }

  return context;
}
