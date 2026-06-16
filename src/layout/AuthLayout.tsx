import { Navigate, Outlet, useLocation } from 'react-router-dom';

import heroImage from '@/assets/images/hero-image.png';
import { useSessionBootstrap } from '@/hooks/useSessionBootstrap';
import { SessionLoadingScreen } from '@/layout/SessionLoadingScreen';
import { useAuthStore } from '@/stores';
import {
  getPostLoginPath,
  getUserRoles,
  isAcceptAdminInvitePath,
} from '@/utils/auth';

export const AuthLayout = () => {
  const { isReady, sessionValid } = useSessionBootstrap();
  const user = useAuthStore((state) => state.user);
  const { pathname } = useLocation();
  const isAcceptAdminInvite = isAcceptAdminInvitePath(pathname);

  if (!isReady) {
    return <SessionLoadingScreen />;
  }

  if (sessionValid && !isAcceptAdminInvite) {
    return <Navigate to={getPostLoginPath(getUserRoles(user))} replace />;
  }

  return (
    <main className="auth-viewport-shell h-viewport overflow-hidden bg-[#f9fafa] sm:p-4">
      <section className="mx-auto flex h-full min-h-0 w-full min-w-0 flex-col bg-[#f9fafa] lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:overflow-hidden lg:rounded-[24px]">
        <aside className="relative hidden min-h-0 overflow-hidden rounded-[22px] lg:block">
          <img
            src={heroImage}
            alt="Surge Africa agents"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-[24px] bottom-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] px-[39px] py-[30px] text-white backdrop-blur-[35px]">
            <h2 className="text-[52px] leading-[54px] font-semibold tracking-[-0.03em]">
              Manage{' '}
              <span className="bg-[linear-gradient(268.123deg,#d04b11_0.14649%,#f9b512_95.466%)] bg-clip-text text-transparent">
                Applications
              </span>
              <br />
              with Ease
            </h2>
            <p className="mt-1 text-[18px] leading-[23px] text-white">
              Help customers apply and manage requests with ease.
            </p>
          </div>
        </aside>

        <section className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:py-4 lg:px-10">
          <div className="flex w-full min-w-0 flex-1 flex-col justify-center py-2">
            <div className="mx-auto w-full min-w-0 max-w-[440px]">
              <Outlet />
            </div>
          </div>
          <p className="shrink-0 pb-1 pt-2 text-center text-xs text-neutral-grey-500 sm:text-sm">
            © 2026 Surge Africa
          </p>
        </section>
      </section>
    </main>
  );
};
