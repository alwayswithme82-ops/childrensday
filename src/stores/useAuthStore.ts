import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { signInAnonymous, saveUser, signOut } from '../services/auth.service';

interface AuthState {
  uid: string | null;
  nickname: string;
  isAuthenticated: boolean;
  login: (nickname: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      uid: null,
      nickname: '',
      isAuthenticated: false,

      login: async (nickname: string) => {
        const uid = await signInAnonymous();
        await saveUser(uid, nickname);
        set({ uid, nickname, isAuthenticated: true });
      },

      logout: async () => {
        await signOut();
        set({ uid: null, nickname: '', isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        uid: state.uid,
        nickname: state.nickname,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
