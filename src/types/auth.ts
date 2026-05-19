export type RegisterApiPayload = {
  full_name: string;
  email: string;
  password: string;
  location_station: string;
};

export type LoginApiPayload = {
  email: string;
  password: string;
};

export type AuthRole = 'user' | 'admin' | (string & {});

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  location_station: string;
  email_verified_at: string | null;
  roles: AuthRole[];
};

export type LoginApiResponse = {
  user: AuthUser;
  access_token: string;
  expires_in: number;
};

export type MeApiResponse = {
  user: AuthUser;
};

/** At least one field required. Changing email clears email_verified_at. */
export type UpdateMeApiPayload = {
  full_name?: string;
  location_station?: string;
  email?: string;
};

export type RegisterApiResponse = {
  user?: AuthUser;
  access_token?: string;
  expires_in?: number;
  message?: string;
  error?: string;
};

export type ForgotPasswordApiPayload = {
  email: string;
};

/** 202 — same message whether or not the email is registered. */
export type ForgotPasswordApiResponse = {
  message: string;
  /** Console/dev only, e.g. https://agent-standup.vercel.app/auth/forgot-password?token=... */
  reset_url?: string;
};

export type ResetPasswordApiPayload = {
  token: string;
  password: string;
};

export type ResetPasswordApiResponse = {
  message?: string;
};

/** POST /auth/accept-admin-invite — token only if account exists; else include profile fields. */
export type AcceptAdminInvitePayload = {
  token: string;
  password?: string;
  full_name?: string;
  location_station?: string;
};

export type AcceptAdminInviteResponse = LoginApiResponse;

/** JWT payload shape from `access_token`. */
export type JwtPayload = {
  sub?: string;
  roles?: AuthRole[];
  iat?: number;
  exp?: number;
};
