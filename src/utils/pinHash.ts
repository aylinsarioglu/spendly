import * as Crypto from 'expo-crypto';

export const PIN_LENGTH = 6;
export const PIN_PATTERN = /^\d{6}$/;

export type PinRecord = {
  version: 1;
  salt: string;
  hash: string;
};

export function isValidPin(pin: string): boolean {
  return PIN_PATTERN.test(pin);
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

export async function createSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return toHex(bytes);
}

export async function hashPin(pin: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${pin}`,
  );
}

export async function verifyPinHash(
  pin: string,
  salt: string,
  expectedHash: string,
): Promise<boolean> {
  const actualHash = await hashPin(pin, salt);
  return timingSafeEqual(actualHash, expectedHash);
}

export function isPinRecord(value: unknown): value is PinRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    record.version === 1 &&
    typeof record.salt === 'string' &&
    record.salt.length > 0 &&
    typeof record.hash === 'string' &&
    record.hash.length > 0
  );
}
