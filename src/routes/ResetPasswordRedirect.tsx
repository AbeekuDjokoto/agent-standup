import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '@/utils/route-constants';

/** Legacy /reset-password and /auth/reset-password links → canonical forgot-password URL. */
export function ResetPasswordRedirect() {
  const { search } = useLocation();
  return (
    <Navigate to={`${ROUTES.user.auth.forgotPassword}${search}`} replace />
  );
}
