import { Navigate } from 'react-router-dom';

import { DailyUpdatesPanel } from '@/features/dashboard/components/DailyUpdatesPanel';
import { NavigationBar } from '@/features/dashboard/components/Navigation';
import {
  dashboardMainClassName,
  dashboardPageClassName,
} from '@/features/dashboard/dashboardPageStyles';
import { useAuthStore } from '@/stores';
import { isAdminSession } from '@/utils/auth';
import { ROUTES } from '@/utils/route-constants';

export const DailyApplicationUpdates = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAdmin = isAdminSession(user, token);

  if (isAdmin) {
    return <Navigate to={ROUTES.user.dashboard.overview} replace />;
  }

  return (
    <div className={dashboardPageClassName}>
      <NavigationBar />
      <main className={dashboardMainClassName}>
        <DailyUpdatesPanel
          showCreateButton
          title="Daily Application Updates"
          mobileTitle="Daily Updates"
          subtitle="Track all applications submitted by you and loan amounts recorded."
          recentHeading="Recent Daily Updates"
          mobileRecentHeading="Recent"
        />
      </main>
    </div>
  );
};
