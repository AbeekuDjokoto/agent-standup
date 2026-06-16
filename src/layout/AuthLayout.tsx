import { Navigate, Outlet, useLocation } from 'react-router-dom';

import heroImage from '@/assets/images/hero-image.png';
import { useSessionBootstrap } from '@/hooks/useSessionBootstrap';
import { SessionLoadingScreen } from '@/layout/SessionLoadingScreen';
import { viewportMinHeightClassName } from '@/layout/layoutStyles';
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
    <main className={`${viewportMinHeightClassName} bg-[#f9fafa] sm:p-4`}>
      <section className="mx-auto flex min-h-viewport w-full min-w-0 flex-col bg-[#f9fafa] sm:min-h-viewport-inset-sm lg:grid lg:max-h-viewport-inset-sm lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:rounded-[24px] lg:overflow-hidden">
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

        <section className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto overflow-x-hidden px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:py-6 lg:justify-center lg:px-10">
          <div className="my-auto w-full min-w-0 max-w-[440px] py-4">
            <Outlet />
          </div>
          <p className="mt-4 shrink-0 pb-2 text-center text-xs text-neutral-grey-500 sm:mt-6 sm:text-sm">
            © 2026 Surge Africa
          </p>
        </section>
      </section>
    </main>
  );
};
