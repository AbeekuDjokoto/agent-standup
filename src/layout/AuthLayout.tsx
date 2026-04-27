import { useAuth } from "@/context/authContext";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "@/utils/route-constants";

const heroImageUrl =
  "https://www.figma.com/api/mcp/asset/98ede2c8-0c62-4f97-9ac0-f3ea665d9bb4";

export const AuthLayout = () => {
  const { userLoggedIn } = useAuth();
  return (
    <>
      {userLoggedIn ? <Navigate to={ROUTES.user.dashboard.overview} replace /> : null}
      <main className="min-h-screen bg-[#f9fafa] p-4">
        <section className="mx-auto grid min-h-[calc(100vh-2rem)] w-full  grid-cols-1 items-center gap-6 rounded-[24px] bg-[#f9fafa] lg:grid-cols-[minmax(480px,1.15fr)_minmax(420px,1fr)]">
          <aside className="relative hidden h-[calc(100vh-3.25rem)] min-h-[600px] overflow-hidden rounded-[22px] lg:block">
            <img
              src={heroImageUrl}
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

          <section className="flex min-h-[500px] flex-col items-center justify-center gap-6 p-4 sm:p-6 lg:p-10">
            <div className="w-full max-w-[440px]">
              <Outlet />
            </div>
            <p className="text-sm text-neutral-grey-500">© 2026 Surge Africa</p>
          </section>
        </section>
      </main>
    </>

  );
};
