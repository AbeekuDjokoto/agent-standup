import type { AuthUser } from '@/types/auth';

/** Public agent user returned by GET /admin/agents/{agent_uuid}. */
export type UserPublic = AuthUser;

export type AgentProfileResponse = {
  user: UserPublic;
};

export type AdminInvitePayload = {
  email: string;
};

export type AdminInviteResponse = {
  email: string;
  expires_at: string;
  message: string;
};
