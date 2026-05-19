import { axiosClient } from '@/config/axios-client';
import type {
  AdminInvitePayload,
  AdminInviteResponse,
  AgentProfileResponse,
} from '@/types/admin';

export async function fetchAgentProfile(
  agentUuid: string,
): Promise<AgentProfileResponse> {
  const data = (await axiosClient.get(
    `/admin/agents/${agentUuid}`,
  )) as AgentProfileResponse;

  if (!data?.user) {
    throw new Error('Agent profile not found.');
  }

  return data;
}

export async function inviteAdmin(
  payload: AdminInvitePayload,
): Promise<AdminInviteResponse> {
  const data = (await axiosClient.post('/admin/invites', {
    email: payload.email.trim(),
  })) as AdminInviteResponse;

  if (!data?.email) {
    throw new Error('Unable to send administrator invitation.');
  }

  return data;
}
