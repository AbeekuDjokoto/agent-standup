import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react';

import { useTabRestorationDetection } from '@/hooks/useTabRestorationDetection';
import { AuthProvider } from '@/context/authContext';

const queryClient = new QueryClient();

function AppInitializer({ children }: { children: React.ReactNode }) {
  useTabRestorationDetection();

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <AppInitializer>{children}</AppInitializer>
        </QueryClientProvider>
      </NuqsAdapter>
    </AuthProvider>
  );
}
