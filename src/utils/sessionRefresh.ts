import { refreshSession } from '@/services/authService';
import { useAuthStore } from '@/stores';
import { isAuthSessionValid } from '@/utils/auth';

let refreshInFlight: Promise<boolean> | null = null;

export function isRefreshRequestUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('/auth/refresh');
}

export function isLogoutRequestUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('/auth/logout');
}

export function isCookieAuthRequestUrl(url?: string): boolean {
  return isRefreshRequestUrl(url) || isLogoutRequestUrl(url);
}

/** Only these responses should update the logged-in session in the auth store. */
export function shouldSyncAuthFromResponse(url?: string): boolean {
  if (!url) return false;

  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/accept-admin-invite') ||
    url.includes('/auth/me')
  );
}

/** POST /auth/refresh using surge_refresh cookie; updates the auth store on success. */
export async function tryRefreshSession(): Promise<boolean> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    try {
      const data = await refreshSession();

      if (
        data?.access_token &&
        data?.user &&
        typeof data.expires_in === 'number'
      ) {
        useAuthStore.getState().authenticateFromLoginResponse(data);
        return true;
      }

      return false;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

const REFRESH_BUFFER_MS = 60_000;

export function shouldProactivelyRefresh(): boolean {
  const state = useAuthStore.getState();

  if (!state.isAuthenticated || !state.expiresAt) {
    return false;
  }

  return Date.now() >= state.expiresAt - REFRESH_BUFFER_MS;
}

export function getSessionValidity() {
  return isAuthSessionValid(useAuthStore.getState());
}
