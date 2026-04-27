import { NavigationBar } from '@/features/dashboard/components/Navigation';

export const Commissions = () => {
  return (
    <div className="min-h-screen bg-[#f9fafa] p-4">
      <NavigationBar />
      <main className="mt-4 rounded-xl bg-white p-6">
        <h1 className="text-2xl font-semibold text-neutral-grey-600">Commissions</h1>
      </main>
    </div>
  );
};
