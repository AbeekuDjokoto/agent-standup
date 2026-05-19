import { Navigate, Outlet } from 'react-router-dom';

import { useSessionBootstrap } from '@/hooks/useSessionBootstrap';
import { ROUTES } from '@/utils/route-constants';

export function ProtectedLayout() {
  const { isReady, sessionValid } = useSessionBootstrap();

  if (!isReady) {
    return null;
  }

  if (!sessionValid) {
    return <Navigate to={ROUTES.user.auth.login} replace />;
  }

  return <Outlet />;
}
