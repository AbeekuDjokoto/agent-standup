import { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { fetchAllDailyActivity } from '@/services/activityService';
import { fetchAgentProfile } from '@/services/adminService';
import type { DailyActivitySummary } from '@/types/activity';
import type { UserPublic } from '@/types/admin';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import type {
  DailyUpdateRecord,
  DateFilterPreset,
} from './useDailyUpdatesList';

function formatActivityDate(value: string | null | undefined): string {
  if (!value) return '-';

  const parsed = value.includes('T')
    ? dayjs(value)
    : dayjs(value, 'YYYY-MM-DD');

  if (!parsed.isValid()) return '-';

  return parsed.format('DD MMM YYYY');
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

export function useAgentProfileActivity(agentUuid: string | null) {
  const [agent, setAgent] = useState<UserPublic | null>(null);
  const [updates, setUpdates] = useState<DailyUpdateRecord[]>([]);
  const [summary, setSummary] = useState<DailyActivitySummary | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilterPreset>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async (uuid: string, preset: DateFilterPreset) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const [profileResponse, activityResponse] = await Promise.all([
        fetchAgentProfile(uuid),
        fetchAllDailyActivity({
          agent_uuid: uuid,
          page: 1,
          page_size: 100,
          ...getFilterParams(preset),
        }),
      ]);

      setAgent(profileResponse.user);
      setUpdates(
        activityResponse.items.map((item) => {
          const reportingDate = item.date || item.submitted.slice(0, 10);

          return {
            id: item.id,
            agentUuid: item.agent_uuid,
            agentName: item.agent_full_name,
            plan: 'Daily Update',
            location: item.location,
            applicationsCount: item.applications,
            loanAmount: item.total_amount,
            status: 'Submitted' as const,
            reportingDate,
            date: formatActivityDate(reportingDate),
          };
        }),
      );
      setSummary(activityResponse.summary);
    } catch (error) {
      setLoadError(
        getApiErrorMessage(error, 'Unable to load agent profile right now.'),
      );
      setAgent(null);
      setUpdates([]);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!agentUuid) {
      setAgent(null);
      setUpdates([]);
      setSummary(null);
      setLoadError(null);
      return;
    }

    void load(agentUuid, dateFilter);
  }, [agentUuid, dateFilter, load]);

  const summaryStats = [
    {
      label: 'Total Updates',
      value: String(summary?.total_updates ?? updates.length),
    },
    {
      label: 'Applications',
      value: String(summary?.total_applications ?? 0),
    },
    {
      label: 'Total Loan',
      value: `GHS ${(summary?.total_loan_amount ?? 0).toLocaleString()}`,
    },
    {
      label: 'Last Update',
      value: formatActivityDate(summary?.last_update),
    },
  ];

  return {
    agent,
    updates,
    summaryStats,
    dateFilter,
    setDateFilter,
    isLoading,
    loadError,
    reload: () => (agentUuid ? load(agentUuid, dateFilter) : Promise.resolve()),
  };
}
