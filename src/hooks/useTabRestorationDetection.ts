import { useEffect } from 'react';

import { useAuthStore } from '@/stores/auth';
import { useUserIdStore } from '@/stores';

/**
 * Hook to detect when a tab is restored (e.g., via Cmd+Shift+T)
 * and clear authentication data to ensure user is logged out
 */
export function useTabRestorationDetection() {
  useEffect(() => {
    // Check if this is a restored tab by looking for the performance navigation type
    const handlePageShow = (event: PageTransitionEvent) => {
      // If the page was restored from cache (like Cmd+Shift+T), clear auth data
      if (event.persisted) {
        useAuthStore.getState().reset();
        useUserIdStore.getState().reset();
      }
    };

    // Listen for the pageshow event to detect tab restoration
    window.addEventListener('pageshow', handlePageShow);

    // Also check on initial load if the page was restored
    if (performance.getEntriesByType('navigation')[0]) {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      if (navigation.type === 'back_forward') {
        useAuthStore.getState().reset();
        useUserIdStore.getState().reset();
      }
    }

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
}
