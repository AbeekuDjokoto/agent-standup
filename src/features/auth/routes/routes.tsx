import type { RouteObject } from 'react-router-dom';
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '@/utils/route-constants';

import { AcceptAdminInvite, ForgotPassword, Login, Register } from '../pages';

function LegacyAuthResetPasswordRedirect() {
  const { search } = useLocation();
  return (
    <Navigate to={`${ROUTES.user.auth.forgotPassword}${search}`} replace />
  );
}

export const userAuthRoutes: RouteObject[] = [
  {
    index: true,
    element: <Login />,
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: ROUTES.user.auth.register.replace('/auth/', ''),
    element: <Register />,
  },
  {
    path: ROUTES.user.auth.acceptAdminInvite.replace('/auth/', ''),
    element: <AcceptAdminInvite />,
  },
  {
    path: 'forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: 'forgot-password/email',
    element: <ForgotPassword />,
  },
  {
    path: ROUTES.user.auth.resetPassword.replace('/auth/', ''),
    element: <LegacyAuthResetPasswordRedirect />,
  },
];
