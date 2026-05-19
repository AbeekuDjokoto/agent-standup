import { axiosClient } from '@/config/axios-client';
import type {
  AcceptAdminInvitePayload,
  AcceptAdminInviteResponse,
  ForgotPasswordApiPayload,
  ForgotPasswordApiResponse,
  LoginApiPayload,
  LoginApiResponse,
  MeApiResponse,
  RegisterApiPayload,
  RegisterApiResponse,
  ResetPasswordApiPayload,
  ResetPasswordApiResponse,
  UpdateMeApiPayload,
} from '@/types/auth';

export async function registerUser(
  payload: RegisterApiPayload,
): Promise<RegisterApiResponse> {
  return axiosClient.post('/auth/register', payload);
}

export async function loginUser(
  payload: LoginApiPayload,
): Promise<LoginApiResponse> {
  const data = (await axiosClient.post(
    '/auth/login',
    payload,
  )) as LoginApiResponse;

  if (!data?.access_token || !data?.user) {
    throw new Error('Login failed. No access token was returned.');
  }

  return data;
}

export async function requestPasswordReset(
  payload: ForgotPasswordApiPayload,
): Promise<ForgotPasswordApiResponse> {
  return axiosClient.post('/auth/forgot-password', payload);
}

export async function resetPassword(
  payload: ResetPasswordApiPayload,
): Promise<ResetPasswordApiResponse> {
  return axiosClient.post('/auth/reset-password', payload);
}

/** Public — accept admin invite from email link token. Issues session like login. */
export async function acceptAdminInvite(
  payload: AcceptAdminInvitePayload,
): Promise<AcceptAdminInviteResponse> {
  const data = (await axiosClient.post(
    '/auth/accept-admin-invite',
    payload,
  )) as AcceptAdminInviteResponse;

  if (!data?.access_token || !data?.user) {
    throw new Error('Unable to accept administrator invitation.');
  }

  return data;
}

/** Requires surge_refresh cookie; no request body. */
export async function refreshSession(): Promise<LoginApiResponse> {
  const data = (await axiosClient.post(
    '/auth/refresh',
    undefined,
  )) as LoginApiResponse;

  if (!data?.access_token || !data?.user) {
    throw new Error('Session refresh failed. No access token was returned.');
  }

  return data;
}

/** Revokes refresh slot and clears surge_refresh cookie. Idempotent; no body. */
export async function logoutSession(): Promise<void> {
  await axiosClient.post('/auth/logout');
}

/** Returns the authenticated user for the current access JWT. */
export async function fetchCurrentUser(): Promise<MeApiResponse> {
  const data = (await axiosClient.get('/auth/me')) as MeApiResponse;

  if (!data?.user) {
    throw new Error('Unable to load current user.');
  }

  return data;
}

/** Update profile; at least one of full_name, location_station, or email. */
export async function updateCurrentUser(
  payload: UpdateMeApiPayload,
): Promise<MeApiResponse> {
  const data = (await axiosClient.patch('/auth/me', payload)) as MeApiResponse;

  if (!data?.user) {
    throw new Error('Unable to update profile.');
  }

  return data;
}
