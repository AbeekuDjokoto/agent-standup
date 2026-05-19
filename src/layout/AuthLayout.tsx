import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSessionBootstrap } from "@/hooks/useSessionBootstrap";
import { useAuthStore } from "@/stores";
import { getPostLoginPath, getUserRoles } from "@/utils/auth";
import { ROUTES } from "@/utils/route-constants";
import heroImage from "@/assets/images/hero-image.png";

export const AuthLayout = () => {
  const { isReady, sessionValid } = useSessionBootstrap();
  const user = useAuthStore((state) => state.user);
  const { pathname } = useLocation();
  const isAcceptAdminInvite = pathname.startsWith(
    ROUTES.user.auth.acceptAdminInvite,
  );

  if (!isReady) {
    return null;
  }

  if (sessionValid && !isAcceptAdminInvite) {
    return <Navigate to={getPostLoginPath(getUserRoles(user))} replace />;
  }

  return (
    <main className="h-dvh max-h-dvh overflow-hidden bg-[#f9fafa] p-0 sm:p-4">
      <section className="mx-auto grid h-full min-h-0 w-full grid-cols-1 items-stretch gap-6 bg-[#f9fafa] sm:rounded-[24px] lg:grid-cols-[minmax(480px,1.15fr)_minmax(420px,1fr)]">
        <aside className="relative hidden min-h-0 overflow-hidden rounded-[22px] lg:block">
          <img
            src={heroImage}
            alt="Surge Africa agents"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-[24px] bottom-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] px-[39px] py-[30px] text-white backdrop-blur-[35px]">
            <h2 className="text-[52px] leading-[54px] font-semibold tracking-[-0.03em]">
              Manage{" "}
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

        <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
          <div className="w-full max-w-[440px] shrink-0">
            <Outlet />
          </div>
          <p className="shrink-0 text-sm text-neutral-grey-500">© 2026 Surge Africa</p>
        </section>
      </section>
    </main>
  );
};
