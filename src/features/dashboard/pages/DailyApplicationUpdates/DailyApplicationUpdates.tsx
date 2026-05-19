import { DailyUpdatesPanel } from '@/features/dashboard/components/DailyUpdatesPanel';
import { NavigationBar } from '@/features/dashboard/components/Navigation';
import {
  dashboardMainClassName,
  dashboardPageClassName,
} from '@/features/dashboard/dashboardPageStyles';
import { useAuthStore } from '@/stores';
import { isAdminSession } from '@/utils/auth';

export const DailyApplicationUpdates = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAdmin = isAdminSession(user, token);

  return (
    <div className={dashboardPageClassName}>
      <NavigationBar />
      <main className={dashboardMainClassName}>
        <DailyUpdatesPanel
          isAdminView={isAdmin}
          showCreateButton={!isAdmin}
          title="Daily Application Updates"
          mobileTitle="Daily Updates"
          subtitle={
            isAdmin
              ? 'View daily application updates across all agents.'
              : 'Track all applications submitted by you and loan amounts recorded.'
          }
          recentHeading={isAdmin ? 'All Agent Updates' : 'Recent Daily Updates'}
          mobileRecentHeading={isAdmin ? 'Updates' : 'Recent'}
        />
      </main>
    </div>
  );
};
