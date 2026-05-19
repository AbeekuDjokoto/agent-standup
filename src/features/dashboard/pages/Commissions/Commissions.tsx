import { NavigationBar } from '@/features/dashboard/components/Navigation';
import {
  dashboardMainClassName,
  dashboardPageClassName,
} from '@/features/dashboard/dashboardPageStyles';

export const Commissions = () => {
  return (
    <div className={dashboardPageClassName}>
      <NavigationBar />
      <main
        className={`${dashboardMainClassName} rounded-xl bg-white p-4 sm:p-6`}
      >
        <h1 className="text-2xl font-semibold text-neutral-grey-600">
          Commissions
        </h1>
      </main>
    </div>
  );
};
