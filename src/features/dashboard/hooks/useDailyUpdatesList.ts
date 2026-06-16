import { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { useAuthHydration } from '@/hooks/useAuthHydration';
import {
  fetchAllDailyActivity,
  fetchMyDailyActivity,
} from '@/services/activityService';
import { useAuthStore } from '@/stores';
import type { DailyActivitySummary } from '@/types/activity';
import {
  isAdminSession,
  isAuthSessionValid,
  resolveUserRoles,
} from '@/utils/auth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import { buildPerformanceChartData } from '../utils/buildPerformanceChartData';

export type DateFilterPreset = 'all' | 'today' | 'week';

export type DailyUpdateRecord = {
  id: string;
  agentUuid?: string;
  agentName: string;
  plan: string;
  location: string;
  applicationsCount: number;
  loanAmount: number;
  status: 'Submitted';
  /** Raw YYYY-MM-DD for sorting and charts. */
  reportingDate: string;
  date: string;
};

function formatActivityDate(value: string | null | undefined): string {
  if (!value) return '-';

  const parsed = value.includes('T')
    ? dayjs(value)
    : dayjs(value, 'YYYY-MM-DD');

  if (!parsed.isValid()) return '-';

  return parsed.format('DD MMM YYYY');
}

function mapItemToRecord(item: {
  id: string;
  agent_uuid: string;
  agent_full_name: string;
  location: string;
  applications: number;
  total_amount: number;
  submitted: string;
  date: string;
}): DailyUpdateRecord {
  const reportingDate = item.date || item.submitted.slice(0, 10);

  return {
    id: item.id,
    agentUuid: item.agent_uuid,
    agentName: item.agent_full_name,
    plan: 'Daily Update',
    location: item.location,
    applicationsCount: item.applications,
    loanAmount: item.total_amount,
    status: 'Submitted',
    reportingDate,
    date: formatActivityDate(reportingDate),
  };
}

function getFilterParams(preset: DateFilterPreset) {
  const today = dayjs().format('YYYY-MM-DD');

  if (preset === 'today') {
    return { date_from: today, date_to: today };
  }

  if (preset === 'week') {
    return {
      date_from: dayjs().startOf('week').format('YYYY-MM-DD'),
      date_to: today,
    };
  }

  return {};
}

type UseDailyUpdatesListOptions = {
  /** When true, loads all agents via GET /activity/daily. */
  isAdminView?: boolean;
};

export function useDailyUpdatesList({
  isAdminView = false,
}: UseDailyUpdatesListOptions = {}) {
  const hasHydrated = useAuthHydration();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isSessionReady =
    hasHydrated && isAuthSessionValid({ token, expiresAt, isAuthenticated });
  const rolesKey = resolveUserRoles(user, token).join(',');
  const isAdmin = isAdminView || isAdminSession(user, token);

  const [dailyUpdates, setDailyUpdates] = useState<DailyUpdateRecord[]>([]);
  const [summary, setSummary] = useState<DailyActivitySummary | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilterPreset>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadDailyUpdates = useCallback(
    async (preset: DateFilterPreset) => {
      if (!isSessionReady) {
        return;
      }

      if (!isAuthenticated) {
        setDailyUpdates([]);
        setSummary(null);
        setIsLoading(false);
        return;
      }

      const { user: sessionUser, token: sessionToken } =
        useAuthStore.getState();
      const useAdminEndpoint =
        isAdminView || isAdminSession(sessionUser, sessionToken);

      try {
        setIsLoading(true);
        setLoadError(null);
        const params = {
          page: 1,
          page_size: 100,
          ...getFilterParams(preset),
        };

        const response = useAdminEndpoint
          ? await fetchAllDailyActivity(params)
          : await fetchMyDailyActivity(params);

        setDailyUpdates(response.items.map(mapItemToRecord));
        setSummary(response.summary);
      } catch (error) {
        setDailyUpdates([]);
        setSummary(null);
        setLoadError(
          getApiErrorMessage(
            error,
            useAdminEndpoint
              ? 'Unable to fetch agent daily updates right now.'
              : 'Unable to fetch daily updates right now.',
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, isAdminView, isSessionReady],
  );

  useEffect(() => {
    if (!isSessionReady) {
      return;
    }

    void loadDailyUpdates(dateFilter);
  }, [isSessionReady, dateFilter, loadDailyUpdates, rolesKey]);

  const totalUpdates = summary?.total_updates ?? dailyUpdates.length;
  const totalApplications = summary?.total_applications ?? 0;
  const totalLoanAmount = summary?.total_loan_amount ?? 0;
  const lastUpdate = formatActivityDate(summary?.last_update);

  const summaryStats = [
    { label: 'Total Updates', value: String(totalUpdates) },
    { label: 'Applications', value: String(totalApplications) },
    {
      label: 'Total Loan Amount',
      value: `GHS ${totalLoanAmount.toLocaleString()}`,
    },
    { label: 'Last Update', value: lastUpdate },
  ];

  const performanceChartData = buildPerformanceChartData(dailyUpdates);

  return {
    isAdmin,
    dailyUpdates,
    summaryStats,
    performanceChartData,
    dateFilter,
    setDateFilter,
    isLoading: !isSessionReady || isLoading,
    loadError,
    reload: () => loadDailyUpdates(dateFilter),
  };
}
