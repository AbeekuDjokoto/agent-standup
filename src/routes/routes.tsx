import React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import { ROUTES } from '@/utils/route-constants';

import ErrorPage from '../components/ErrorPage';
import { userAuthRoutes } from '../features/auth/routes/routes';
import { userDashboaudRoutes } from '../features/dashboard/routes/routes';
import { AuthLayout } from '../layout/AuthLayout';
import { ProtectedLayout } from '../layout/ProtectedLayout';
import { ResetPasswordRedirect } from './ResetPasswordRedirect';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={ROUTES.user.auth.login} replace />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordRedirect />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: userAuthRoutes,
  },
  {
    path: '/dashboard',
    element: <ProtectedLayout />,
    errorElement: <ErrorPage />,
    children: userDashboaudRoutes,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.user.auth.login} replace />,
  },
  // {
  //   path: '/policies',
  //   children: userPoliciesRoutes,
  // },
];
