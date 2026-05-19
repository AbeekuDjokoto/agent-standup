import { fetchCurrentUser } from '@/services/authService';
import { useAuthStore } from '@/stores';
import type { AuthUser } from '@/types/auth';

/** Loads GET /auth/me and updates the persisted user in the auth store. */
export async function syncCurrentUser(): Promise<AuthUser | null> {
  try {
    const { user } = await fetchCurrentUser();
    useAuthStore.getState().setUser(user);
    return user;
  } catch {
    return null;
  }
}
