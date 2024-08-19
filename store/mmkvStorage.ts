import { MMKV } from "react-native-mmkv";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// Initialize MMKV instance
const storage = new MMKV();

// Helper functions for MMKV operations
export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? (JSON.parse(value) as T) : null;
}

export function setItem<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  storage.delete(key);
}

// Create a storage object compatible with Jotai's atomWithStorage
const mmkvStorage = {
  getItem,
  setItem,
  removeItem,
};

// Custom atom creator that uses MMKV storage
export function atomWithMMKV<T>(key: string, initialValue: T) {
  return atomWithStorage<T>(
    key,
    initialValue,
    createJSONStorage<T>(() => mmkvStorage),
  );
}

// Export MMKV instance for direct usage if needed
export { storage as mmkvInstance };
