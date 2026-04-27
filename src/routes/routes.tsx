import React from 'react';
import { Navigate, Outlet, type RouteObject } from 'react-router-dom';
import { AuthLayout } from '../layout/AuthLayout';
import ErrorPage from '../components/ErrorPage';
import { userAuthRoutes } from '../features/auth/routes/routes';
import { userDashboaudRoutes } from '../features/dashboard/routes/routes';
import { ROUTES } from '@/utils/route-constants';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={ROUTES.user.auth.login} replace />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: userAuthRoutes,
  },
  {
    path: '/dashboard',
    element: <Outlet />,
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
