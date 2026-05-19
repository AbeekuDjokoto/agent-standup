import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores';
import { isAdminSession } from '@/utils/auth';
import { ROUTES } from '@/utils/route-constants';

type AgentOnlyRouteProps = {
  children: React.ReactNode;
};

export function AgentOnlyRoute({ children }: AgentOnlyRouteProps) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  if (isAdminSession(user, token)) {
    return <Navigate to={ROUTES.user.dashboard.overview} replace />;
  }

  return <>{children}</>;
}
