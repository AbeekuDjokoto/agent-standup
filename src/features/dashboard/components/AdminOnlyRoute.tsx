import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores';
import {
  getPostLoginPath,
  isAdminSession,
  resolveUserRoles,
} from '@/utils/auth';

type AdminOnlyRouteProps = {
  children: React.ReactNode;
};

export function AdminOnlyRoute({ children }: AdminOnlyRouteProps) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const roles = resolveUserRoles(user, token);

  if (!isAdminSession(user, token)) {
    return <Navigate to={getPostLoginPath(roles)} replace />;
  }

  return <>{children}</>;
}
