import { useEffect, useState } from 'react';

import { useAuthHydration } from '@/hooks/useAuthHydration';
import { useAuthStore } from '@/stores';
import { isAuthSessionValid } from '@/utils/auth';
import { tryRefreshSession } from '@/utils/sessionRefresh';
import { syncCurrentUser } from '@/utils/syncCurrentUser';

/**
 * After persist rehydration, attempts cookie-based refresh when the access JWT
 * is missing or expired (e.g. new tab, expired token, refresh cookie still valid).
 */
export function useSessionBootstrap() {
  const hasHydrated = useAuthHydration();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    let cancelled = false;

    async function bootstrap() {
      try {
        const state = useAuthStore.getState();

        if (!isAuthSessionValid(state)) {
          const refreshed = await tryRefreshSession();

          if (!refreshed && state.isAuthenticated) {
            useAuthStore.getState().reset();
          }
        }

        if (isAuthSessionValid(useAuthStore.getState())) {
          await syncCurrentUser();
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [hasHydrated]);

  const sessionValid = useAuthStore((state) =>
    isAuthSessionValid({
      token: state.token,
      expiresAt: state.expiresAt,
      isAuthenticated: state.isAuthenticated,
    }),
  );

  return {
    hasHydrated,
    isReady: hasHydrated && isReady,
    sessionValid,
  };
}
