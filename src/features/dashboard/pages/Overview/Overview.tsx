import { AdminInviteSection } from '@/features/dashboard/components/AdminInviteSection';
import { DailyUpdatesPanel } from '@/features/dashboard/components/DailyUpdatesPanel';
import { NavigationBar } from '@/features/dashboard/components/Navigation';

export const Overview = () => {
  return (
    <div className="min-h-screen bg-[#f9fafa] p-3 md:p-4">
      <NavigationBar />
      <main className="mt-3 space-y-3 md:mt-4 md:space-y-4">
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
