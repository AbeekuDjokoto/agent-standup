import { logoutSession } from '@/services/authService';
import { useAuthStore, useUserIdStore } from '@/stores';

/** Clears server session (cookie + Redis) and local auth state. */
export async function logoutUser(): Promise<void> {
  try {
    await logoutSession();
  } catch {
    // Idempotent — always clear client state even if the request fails.
  }

  useAuthStore.getState().reset();
  useUserIdStore.getState().reset();
}
