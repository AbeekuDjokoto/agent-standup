import { Navigate } from 'react-router-dom';

import { DailyUpdatesPanel } from '@/features/dashboard/components/DailyUpdatesPanel';
import { NavigationBar } from '@/features/dashboard/components/Navigation';
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
    <div className="min-h-screen bg-[#f9fafa] p-3 md:p-4">
      <NavigationBar />
      <main className="mt-3 space-y-3 md:mt-4 md:space-y-4">
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
