import { create } from 'zustand';
import { storage } from './storage';

const TOKEN_KEY = 'mask.auth.token';
const USER_KEY = 'mask.auth.user';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  hasHydrated: boolean;
  token: string | null;
  user: User | null;
  hydrate: () => Promise<void>;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  hasHydrated: false,
  token: null,
  user: null,

  hydrate: async () => {
    try {
      const [token, userJson] = await Promise.all([
        storage.get(TOKEN_KEY),
        storage.get(USER_KEY),
      ]);
      const user = userJson ? (JSON.parse(userJson) as User) : null;
      set({
        token,
        user,
        isAuthenticated: Boolean(token),
        hasHydrated: true,
      });
    } catch {
      set({ hasHydrated: true });
    }
  },

  login: (token, user) => {
    set({ isAuthenticated: true, token, user });
    void storage.set(TOKEN_KEY, token);
    void storage.set(USER_KEY, JSON.stringify(user));
  },

  logout: () => {
    set({ isAuthenticated: false, token: null, user: null });
    void storage.remove(TOKEN_KEY);
    void storage.remove(USER_KEY);
  },

  updateUser: (updates) => {
    const current = get().user;
    if (!current) return;
    const next = { ...current, ...updates };
    set({ user: next });
    void storage.set(USER_KEY, JSON.stringify(next));
  },
}));
