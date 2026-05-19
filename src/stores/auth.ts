import { create, StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthUser, LoginApiResponse } from '@/types/auth';
import { isAuthSessionValid } from '@/utils/auth';

type State = {
  token?: string | null;
  user?: AuthUser | null;
  expiresAt?: number | null;
  isAuthenticated: boolean;
  redirect?: string;
  loginUrl: string;
  fcmToken?: string | null;
};

type AuthenticateInput = {
  accessToken: string;
  user: AuthUser;
  expiresIn: number;
  loginUrl?: string;
};

type Actions = {
  reset: () => void;
  authenticate: (details: AuthenticateInput) => AuthUser;
  authenticateFromLoginResponse: (response: LoginApiResponse) => AuthUser;
  setRedirect: (redirect: string) => void;
  getToken: () => State['token'];
  logout: () => void;
  setUser: (newUser: AuthUser) => void;
  setFcmToken: (newFcmToken: string) => void;
  isSessionValid: () => boolean;
};

const initialState: State = {
  token: null,
  isAuthenticated: false,
  user: null,
  expiresAt: null,
  loginUrl: '/auth/login',
};

const authStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,
  reset: () => set(initialState),
  authenticate: ({
    accessToken,
    user,
    expiresIn,
    loginUrl = '/auth/login',
  }) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    set({
      user,
      token: accessToken,
      expiresAt,
      isAuthenticated: true,
      loginUrl,
    });
    return user;
  },
  authenticateFromLoginResponse: (response) =>
    get().authenticate({
      accessToken: response.access_token,
      user: response.user,
      expiresIn: response.expires_in,
    }),
  logout: () => set({ ...initialState }),
  setRedirect: (redirect: string) => set({ redirect }),
  getToken: () => get().token,
  setUser: (newUser: AuthUser) => set({ user: newUser }),
  setFcmToken: (newFcmToken: string) => set({ fcmToken: newFcmToken }),
  isSessionValid: () => isAuthSessionValid(get()),
});

const useAuthStore = create(
  persist(authStore, {
    name: 'surge-web-auth-store',
    storage: createJSONStorage(() => sessionStorage),
    onRehydrateStorage: () => () => {
      // Expired access JWT may still be renewable via surge_refresh cookie.
      // useSessionBootstrap attempts refresh before clearing the session.
    },
  }),
);

export { useAuthStore };
