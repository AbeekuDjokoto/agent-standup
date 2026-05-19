import { useAuth } from '@/context/authContext';
import { useAuthStore } from '@/stores';
import { getAuthDisplayName, isAuthSessionValid } from '@/utils/auth';

export function useAgentIdentity() {
  const { currentUser } = useAuth();
  const storeUser = useAuthStore((state) => state.user);
  const isApiAuthenticated = useAuthStore((state) =>
    isAuthSessionValid(state),
  );

  const agentUid = currentUser?.uid ?? storeUser?.id ?? null;
  const displayName =
    currentUser?.displayName?.trim() ||
    getAuthDisplayName(storeUser) ||
    currentUser?.email?.split('@')[0] ||
    'Agent User';
  const email = currentUser?.email ?? storeUser?.email ?? '';
  const locationStation = storeUser?.location_station ?? '';

  return {
    agentUid,
    displayName,
    email,
    locationStation,
    roles: storeUser?.roles ?? [],
    isLoggedIn: Boolean(agentUid) || isApiAuthenticated,
  };
}
