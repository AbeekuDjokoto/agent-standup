import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  id?: string | null;
};

type Actions = {
  /** Reset auth store to initial state */
  reset: () => void;
  /** Get the current user ID */
  getUserId: () => State['id'];
  /** Set a new user ID */
  setUserId: (userId: string | null) => void;
};

const initialState: State = {
  id: null,
};

const authStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,
  reset: () => set(initialState),

  getUserId: () => get().id,

  setUserId: (userId: string | null) => {
    set({ id: userId });
  },
});

const useUserIdStore = create(
  persist(authStore, {
    name: 'storing-user-id-auth-store',
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

export { useUserIdStore };
