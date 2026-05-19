import { AdminOnlyRoute } from '../components/AdminOnlyRoute';
import { AgentOnlyRoute } from '../components/AgentOnlyRoute';
import { DashboardIndexRedirect } from '../components/DashboardIndexRedirect';
import { Overview } from '../pages/Overview';
import { DailyApplicationUpdates } from '../pages/DailyApplicationUpdates';
import { Commissions } from '../pages/Commissions';
import { NewDailyApplicationUpdate } from '../pages/NewDailyApplicationUpdate';

export const userDashboaudRoutes = [
  {
    index: true,
    element: <DashboardIndexRedirect />,
  },
  {
    path: 'overview',
    element: (
      <AdminOnlyRoute>
        <Overview />
      </AdminOnlyRoute>
    ),
  },
  {
    path: 'daily-application-updates',
    element: <DailyApplicationUpdates />,
  },
  {
    path: 'daily-application-updates/new',
    element: (
      <AgentOnlyRoute>
        <NewDailyApplicationUpdate />
      </AgentOnlyRoute>
    ),
  },
  {
    path: 'commissions',
    element: (
      <AdminOnlyRoute>
        <Commissions />
      </AdminOnlyRoute>
    ),
  },
  {
    path: '*',
    element: <DashboardIndexRedirect />,
  },
];
