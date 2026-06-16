import { Navigate, Outlet } from 'react-router-dom';

import { useSessionBootstrap } from '@/hooks/useSessionBootstrap';
import { SessionLoadingScreen } from '@/layout/SessionLoadingScreen';
import { viewportMinHeightClassName } from '@/layout/layoutStyles';
import { ROUTES } from '@/utils/route-constants';

export function ProtectedLayout() {
  const { isReady, sessionValid } = useSessionBootstrap();

  if (!isReady) {
    return <SessionLoadingScreen />;
  }

  if (!sessionValid) {
    return <Navigate to={ROUTES.user.auth.login} replace />;
  }

  return (
    <div className={`${viewportMinHeightClassName} flex min-h-0 flex-1 flex-col`}>
      <Outlet />
    </div>
  );
}
