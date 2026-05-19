import { axiosClient } from '@/config/axios-client';
import { useAuthStore } from '@/stores';
import type {
  AllDailyActivityParams,
  CreateDailyActivityPayload,
  DailyActivityDetailResponse,
  MyDailyActivityParams,
  MyDailyActivityResponse,
  UpdateDailyActivityPayload,
} from '@/types/activity';
import { isAdminSession } from '@/utils/auth';

export async function fetchMyDailyActivity(
  params?: MyDailyActivityParams,
): Promise<MyDailyActivityResponse> {
  const { user, token } = useAuthStore.getState();

  if (isAdminSession(user, token)) {
    return fetchAllDailyActivity(params);
  }

  return axiosClient.get('/activity/daily/me', { params });
}

export async function fetchAllDailyActivity(
  params?: AllDailyActivityParams,
): Promise<MyDailyActivityResponse> {
  return axiosClient.get('/activity/daily', { params });
}

export async function createDailyActivity(
  payload: CreateDailyActivityPayload,
): Promise<DailyActivityDetailResponse> {
  const data = (await axiosClient.post(
    '/activity/daily',
    payload,
  )) as DailyActivityDetailResponse;

  if (!data?.daily_activity) {
    throw new Error('Unable to submit daily activity.');
  }

  return data;
}

export async function fetchDailyActivityById(
  dailyActivityId: string,
): Promise<DailyActivityDetailResponse> {
  const data = (await axiosClient.get(
    `/activity/daily/${dailyActivityId}`,
  )) as DailyActivityDetailResponse;

  if (!data?.daily_activity) {
    throw new Error('Daily update not found.');
  }

  return data;
}

export async function updateDailyActivity(
  dailyActivityId: string,
  payload: UpdateDailyActivityPayload,
): Promise<DailyActivityDetailResponse> {
  const data = (await axiosClient.patch(
    `/activity/daily/${dailyActivityId}`,
    payload,
  )) as DailyActivityDetailResponse;

  if (!data?.daily_activity) {
    throw new Error('Unable to update daily activity.');
  }

  return data;
}
