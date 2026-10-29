import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/types/api';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hasHydrated: boolean; // Mengecek apakah sudah selesai membaca localStorage?
  setAuth: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasHydrated: false,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'sociality-auth', // key di localStorage
      partialize: (s) => ({ token: s.token, user: s.user }), // hanya token & user yang disimpan
      skipHydration: true, // jangan baca localStorage otomatis; dipanggil manual di Providers
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // tandai selesai setelah localStorage dibaca
      },
    }
  )
);
