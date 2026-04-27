// import { jwtDecode } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AdminUser, User } from '@/types';

type State = {
  token?: string | null;
  user?: User | AdminUser | null;
  isAuthenticated: boolean;
  redirect?: string;
  loginUrl: string;
  fcmToken?: string | null;
};

type Actions = {
  /** reset auth store to initial state */
  reset: () => void;
  /**
   * authenticate user
   * @param {Object} details - object containing user object and token
   */
  // authenticate: (details: { token: string; loginUrl?: string }) => void;
  authenticate: (details: any) => void;
  setRedirect: (redirect: string) => void;
  getToken: () => State['token'];
  setToken: (newToken: string) => void;
  logout: () => void;
  setUser: (newUser: User | AdminUser) => void;
  setFcmToken: (newFcmToken: string) => void;
};

const initialState: State = {
  token: null,
  isAuthenticated: false,
  user: null,
  loginUrl: '/auth/login',
};

const authStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,
  reset: () => set(initialState),
  authenticate: ({ token, loginUrl = '/auth/login' }) => {
    const user: User = jwtDecode(token);
    set({
      user,
      token,
      isAuthenticated: true,
      loginUrl,
    });
  },
  logout: () => set({ isAuthenticated: false }),
  setRedirect: (redirect: string) => set({ redirect }),
  getToken: () => get().token,
  setToken: (newToken: string) => set({ token: newToken }),
  setUser: (newUser: User | AdminUser) => set({ user: newUser }),
  setFcmToken: (newFcmToken: string) => set({ fcmToken: newFcmToken }),
});

const useAuthStore = create(
  persist(authStore, {
    name: 'goldbucks-web-auth-store',
    storage: {
      getItem: (name) => {
        const str = sessionStorage.getItem(name);
        return str ? JSON.parse(str) : null;
      },
      setItem: (name, value) => {
        sessionStorage.setItem(name, JSON.stringify(value));
      },
      removeItem: (name) => sessionStorage.removeItem(name),
    },
  }),
);

export { useAuthStore };
