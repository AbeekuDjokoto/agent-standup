import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/stores';
import { getPostLoginPath, getUserRoles } from '@/utils/auth';

export function DashboardIndexRedirect() {
  const user = useAuthStore((state) => state.user);
  return <Navigate to={getPostLoginPath(getUserRoles(user))} replace />;
}
