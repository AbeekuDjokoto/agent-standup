import type { RouteObject } from 'react-router-dom';
import { ForgotPassword, Login, Register } from '../pages';
import { ROUTES } from '@/utils/route-constants';

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
    path: 'forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: 'forgot-password/email',
    element: <ForgotPassword />,
  },
  {
    path: ROUTES.user.auth.resetPassword.replace('/auth/', ''),
    element: <ForgotPassword />,
  },
];
