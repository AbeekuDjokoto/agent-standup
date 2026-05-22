import { jwtDecode } from 'jwt-decode';

import type {
  AuthRole,
  AuthUser,
  ForgotPasswordApiResponse,
  JwtPayload,
} from '@/types/auth';
import { ROUTES } from '@/utils/route-constants';

type SessionSlice = {
  token?: string | null;
  user?: AuthUser | null;
  expiresAt?: number | null;
  isAuthenticated?: boolean;
};

export function getUserRoles(user: AuthUser | null | undefined): AuthRole[] {
  return user?.roles ?? [];
}

export function hasAuthRole(
  user: AuthUser | null | undefined,
  role: AuthRole,
): boolean {
  return getUserRoles(user).includes(role);
}

export function isAuthSessionValid(state: SessionSlice): boolean {
  if (!state.token || !state.isAuthenticated) {
    return false;
  }

  if (state.expiresAt && Date.now() >= state.expiresAt) {
    return false;
  }

  try {
    const payload = jwtDecode<JwtPayload>(state.token);
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function hasAdminAccess(roles: AuthRole[] = []): boolean {
  return roles.includes('admin');
}

/** Roles from persisted user, falling back to the access JWT payload. */
export function getRolesFromAccessToken(
  token: string | null | undefined,
): AuthRole[] {
  if (!token) return [];

  try {
    const payload = jwtDecode<JwtPayload>(token);
    return payload.roles ?? [];
  } catch {
    return [];
  }
}

export function resolveUserRoles(
  user: AuthUser | null | undefined,
  token?: string | null,
): AuthRole[] {
  const fromUser = user?.roles ?? [];
  const fromToken = getRolesFromAccessToken(token);

  return [...new Set([...fromUser, ...fromToken])];
}

export function isAdminSession(
  user: AuthUser | null | undefined,
  token?: string | null,
): boolean {
  return hasAdminAccess(resolveUserRoles(user, token));
}

/** Default landing route after login. Agents (user role) see daily updates only. */
export function getPostLoginPath(roles: AuthRole[] = []): string {
  if (hasAdminAccess(roles)) {
    return ROUTES.user.dashboard.overview;
  }

  return ROUTES.user.dashboard.dailyApplicationUpdates;
}

export function getAuthDisplayName(user: AuthUser | null | undefined): string {
  if (!user) return '';
  return user.full_name?.trim() || user.email?.split('@')[0] || '';
}

/** Matches POST /auth/forgot-password 202 body; same for every email. */
export const FORGOT_PASSWORD_SUCCESS_MESSAGE =
  'If an account exists for that email, you will receive password reset instructions.';

export function getForgotPasswordSuccessMessage(
  response?: Pick<ForgotPasswordApiResponse, 'message'> | null,
): string {
  return response?.message?.trim() || FORGOT_PASSWORD_SUCCESS_MESSAGE;
}

/** Invite acceptance pages (logged-in users may still open the link). */
export function isAcceptAdminInvitePath(pathname: string): boolean {
  return (
    pathname.startsWith(ROUTES.user.auth.acceptInvite) ||
    pathname.startsWith(ROUTES.user.auth.acceptAdminInvite)
  );
}

export function getResetPasswordPathFromUrl(resetUrl: string): string {
  try {
    const { pathname, search } = new URL(resetUrl);
    return `${pathname}${search}`;
  } catch {
    return resetUrl.startsWith('/') ? resetUrl : `/${resetUrl}`;
  }
}
