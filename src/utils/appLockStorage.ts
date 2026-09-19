import * as SecureStore from 'expo-secure-store';

import { isPinRecord, type PinRecord } from './pinHash';

const PIN_RECORD_KEY = 'spendly.pin.record';

const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export async function isAppLockStorageAvailable(): Promise<boolean> {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function getPinHash(): Promise<PinRecord | null> {
  const available = await isAppLockStorageAvailable();

  if (!available) {
    return null;
  }

  try {
    const stored = await SecureStore.getItemAsync(
      PIN_RECORD_KEY,
      SECURE_STORE_OPTIONS,
    );

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);
    return isPinRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function hasPin(): Promise<boolean> {
  const record = await getPinHash();
  return record !== null;
}

export async function setPinHash(record: PinRecord): Promise<void> {
  const available = await isAppLockStorageAvailable();

  if (!available) {
    throw new Error('SecureStore is not available.');
  }

  await SecureStore.setItemAsync(
    PIN_RECORD_KEY,
    JSON.stringify(record),
    SECURE_STORE_OPTIONS,
  );
}

export async function clearPinHash(): Promise<void> {
  const available = await isAppLockStorageAvailable();

  if (!available) {
    return;
  }

  await SecureStore.deleteItemAsync(PIN_RECORD_KEY, SECURE_STORE_OPTIONS);
}
