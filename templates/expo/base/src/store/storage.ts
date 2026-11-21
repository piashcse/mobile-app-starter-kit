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
    if (Platform.OS === 'web') {
      return webStorage?.getItem(key) ?? null;
    }
    return SecureStore.getItemAsync(key);
  },

  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      webStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      webStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
