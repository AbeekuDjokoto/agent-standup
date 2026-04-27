import { NavLink, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/utils/route-constants';
import { cn } from '@/libs/cn';
import { useAuth } from '@/context/authContext';
import { doSignOut } from '@/features/auth/hooks';

const logoMarkUrl =
  'https://www.figma.com/api/mcp/asset/2530164a-9549-49a6-b656-043d355f5d7b';
const dashboardIconUrl =
  'https://www.figma.com/api/mcp/asset/0c506dc1-9153-4bbb-b0b3-f80a2f1d550a';
const calendarIconUrl =
  'https://www.figma.com/api/mcp/asset/d9c85f01-6284-45fc-ad8e-e57c75babe30';
const commissionsIconUrl =
  'https://www.figma.com/api/mcp/asset/e1b68778-f559-4186-9819-90ce45814c45';

const NAV_ITEMS = [
    {
        label: 'Dashboard',
        to: ROUTES.user.dashboard.overview,
    icon: dashboardIconUrl,
    },
    {
        label: 'Daily Updates',
        to: ROUTES.user.dashboard.dailyApplicationUpdates,
    icon: calendarIconUrl,
    },
    {
        label: 'Commissions',
        to: ROUTES.user.dashboard.commissions,
    icon: commissionsIconUrl,
    },
];

export default function NavigationBar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const displayName =
    currentUser?.displayName?.trim() ||
    currentUser?.email?.split('@')[0] ||
    'Agent User';
  const email = currentUser?.email || 'agent@surge.com';
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  async function handleSignOut() {
    await doSignOut();
    navigate(ROUTES.user.auth.login, { replace: true });
  }

  return (
    <header className="w-full rounded-[12px] bg-white px-3 py-3 sm:px-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
          <img src={logoMarkUrl} alt="Surge logo mark" className="h-8 w-8 object-contain" />
          <span className="text-3xl leading-none font-semibold tracking-[-0.04em] text-[#0f1115] sm:text-[40px]">
            surge
          </span>
          </div>

          <div className="flex min-w-[150px] items-center gap-2 rounded-[10px] bg-white px-1 py-1 sm:min-w-[220px] sm:px-2">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={displayName}
                className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-full bg-neutral-grey-200 text-xs text-neutral-grey-500 sm:h-10 sm:w-10 sm:text-sm">
                {initials || 'AU'}
              </div>
            )}
            <div className="hidden min-w-0 flex-1 sm:block">
              <p className="truncate text-sm font-medium text-neutral-grey-600">
                {displayName}
              </p>
              <p className="truncate text-xs text-neutral-grey-500">{email}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded px-2 py-1 text-xs font-medium text-neutral-grey-500 hover:bg-neutral-grey-100"
            >
              Logout
            </button>
          </div>
        </div>

        <nav className="-mx-1 flex items-center gap-1 overflow-x-auto px-1 pb-1 xl:mx-0 xl:px-0 xl:pb-0">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-neutral-grey-100 text-neutral-grey-600'
                    : 'text-neutral-grey-500 hover:bg-neutral-grey-100',
                )
              }
            >
              <img src={item.icon} alt="" className="h-5 w-5 object-contain" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
