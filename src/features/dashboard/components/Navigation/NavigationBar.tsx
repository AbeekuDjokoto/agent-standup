import { NavLink } from 'react-router-dom';

import { ROUTES } from '@/utils/route-constants';
import { cn } from '@/libs/cn';
import { useAgentIdentity } from '@/hooks';
import { useLogout } from '@/features/auth/hooks';
import { hasAdminAccess } from '@/utils/auth';
import calendarLineIcon from '@/assets/svgs/calendar-line.svg';
import dashboardIcon from '@/assets/svgs/layout-grid-line.svg';

const logoMarkUrl = '/favicon.png';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: ROUTES.user.dashboard.overview,
    icon: dashboardIcon,
    adminOnly: true,
  },
  {
    label: 'Daily Updates',
    to: ROUTES.user.dashboard.dailyApplicationUpdates,
    icon: calendarLineIcon,
    adminOnly: false,
  },
];

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function NavLinks({
  items,
  className,
}: {
  items: typeof NAV_ITEMS;
  className?: string;
}) {
  return (
    <nav className={cn('flex items-center gap-1', className)}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === ROUTES.user.dashboard.overview}
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
          <span className="whitespace-nowrap">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function NavigationBar() {
  const { displayName, email, roles } = useAgentIdentity();
  const { logout } = useLogout();
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const navItems = hasAdminAccess(roles)
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) => !item.adminOnly);

  return (
    <header className="w-full rounded-xl bg-white px-3 py-2.5 sm:px-4 sm:py-3">
      {/* Mobile */}
      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={logoMarkUrl}
              alt="Surge"
              className="h-7 w-7 shrink-0 object-contain"
            />
            <span className="truncate text-xl font-semibold tracking-tight text-[#0f1115]">
              surge
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <div
              className="grid h-8 w-8 place-items-center rounded-full bg-neutral-grey-200 text-xs font-medium text-neutral-grey-600"
              title={displayName}
            >
              {initials || 'AU'}
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              className="grid h-8 w-8 place-items-center rounded-lg text-neutral-grey-500 transition hover:bg-neutral-grey-100"
              aria-label="Log out"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>

        {navItems.length > 1 ? (
          <NavLinks
            items={navItems}
            className="gap-1 overflow-x-auto border-t border-neutral-grey-100 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          />
        ) : null}
      </div>

      {/* Desktop */}
      <div className="hidden items-center justify-between gap-6 md:flex">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <div className="flex shrink-0 items-center gap-2">
            <img
              src={logoMarkUrl}
              alt="Surge"
              className="h-8 w-8 object-contain"
            />
            <span className="text-2xl font-semibold tracking-tight text-[#0f1115] lg:text-[32px]">
              surge
            </span>
          </div>

          <NavLinks items={navItems} className="min-w-0" />
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-[10px] py-1 pl-1">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-neutral-grey-200 text-sm font-medium text-neutral-grey-600">
            {initials || 'AU'}
          </div>
          <div className="hidden min-w-0 lg:block">
            <p className="max-w-[180px] truncate text-sm font-medium text-neutral-grey-600">
              {displayName}
            </p>
            <p className="max-w-[180px] truncate text-xs text-neutral-grey-500">
              {email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-grey-500 transition hover:bg-neutral-grey-100"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
