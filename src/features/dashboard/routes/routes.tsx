import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/utils/route-constants';
import { Overview } from '../pages/Overview';
import { DailyApplicationUpdates } from '../pages/DailyApplicationUpdates';
import { Commissions } from '../pages/Commissions';
import { NewDailyApplicationUpdate } from '../pages/NewDailyApplicationUpdate';



export const userDashboaudRoutes = [
  {
    index: true,
    element: <Navigate to={ROUTES.user.dashboard.overview} />,
  },
  {
    path: 'overview',
    element: <Overview />,
  },
  {
    path: 'daily-application-updates',
    element: <DailyApplicationUpdates />,
  },
  {
    path: 'daily-application-updates/new',
    element: <NewDailyApplicationUpdate />,
  },
  {
    path: 'commissions',
    element: <Commissions />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.user.dashboard.overview} replace />,
  },
];
