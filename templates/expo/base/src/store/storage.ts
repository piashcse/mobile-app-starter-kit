import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Cross-platform key/value storage.
 * SecureStore is used on iOS/Android; localStorage keeps web builds working.
 */
const webStorage =
  typeof localStorage !== 'undefined' ? localStorage : undefined;

export const storage = {
  async get(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return webStorage?.getItem(key) ?? null;
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        webStorage?.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Persistence is best-effort; the in-memory state still works.
    }
  },

  async remove(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        webStorage?.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Ignore storage failures.
    }
  },
};
