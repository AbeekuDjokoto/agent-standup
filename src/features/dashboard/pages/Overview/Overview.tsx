import { AdminInviteSection } from '@/features/dashboard/components/AdminInviteSection';
import { DailyUpdatesPanel } from '@/features/dashboard/components/DailyUpdatesPanel';
import { NavigationBar } from '@/features/dashboard/components/Navigation';
import {
  dashboardMainClassName,
  dashboardPageClassName,
} from '@/features/dashboard/dashboardPageStyles';

export const Overview = () => {
  return (
    <div className={dashboardPageClassName}>
      <NavigationBar />
      <main className={dashboardMainClassName}>
        <AdminInviteSection />
        <DailyUpdatesPanel
          isAdminView
          showCreateButton={false}
          title="Dashboard Overview"
          mobileTitle="Overview"
          subtitle="View daily application updates across all agents."
          recentHeading="All Agent Updates"
          mobileRecentHeading="Updates"
        />
      </main>
    </div>
  );
};
