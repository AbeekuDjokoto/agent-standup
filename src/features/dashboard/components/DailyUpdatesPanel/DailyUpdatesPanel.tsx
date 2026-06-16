import { useState } from 'react';
import { Link } from 'react-router-dom';

import { FormAlert } from '@/components/FormAlert';
import { AgentPerformanceChart } from '@/features/dashboard/components/AgentPerformanceChart';
import { AgentProfileModal } from '@/features/dashboard/components/AgentProfileModal';
import { DailyActivityDetailModal } from '@/features/dashboard/components/DailyActivityDetailModal';
import { DailyUpdateCard } from '@/features/dashboard/components/DailyUpdateCard';
import { DailyUpdatesSummary } from '@/features/dashboard/components/DailyUpdatesSummary';
import {
  type DateFilterPreset,
  useDailyUpdatesList,
} from '@/features/dashboard/hooks/useDailyUpdatesList';
import { fetchDailyActivityById } from '@/services/activityService';
import type { DailyActivityItem } from '@/types/activity';
import { isWeekendInTimeZone } from '@/utils/businessDays';
import {
  type CsvHeader,
  generateAndDownloadCsv,
} from '@/utils/generateAndDownloadCsv';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { ROUTES } from '@/utils/route-constants';

const statusStyles = {
  Submitted: 'bg-[#eff8ff] text-[#175cd3] ring-[#b2ddff]',
} as const;

type DailyUpdatesPanelProps = {
  isAdminView?: boolean;
  showCreateButton?: boolean;
  title: string;
  mobileTitle?: string;
  subtitle?: string;
  recentHeading?: string;
  mobileRecentHeading?: string;
};

function filterButtonClass(active: boolean) {
  return `rounded-lg border px-3 py-1.5 text-xs font-medium ${
    active
      ? 'border-[#fc9b1e] bg-[#fff7ed] text-[#c2410c]'
      : 'border-neutral-grey-200 text-neutral-grey-500 hover:bg-neutral-grey-100'
  }`;
}

export function DailyUpdatesPanel({
  isAdminView = false,
  showCreateButton = true,
  title,
  mobileTitle,
  subtitle,
  recentHeading = 'Recent Daily Updates',
  mobileRecentHeading = 'Recent',
}: DailyUpdatesPanelProps) {
  const {
    isAdmin,
    dailyUpdates,
    summaryStats,
    performanceChartData,
    dateFilter,
    setDateFilter,
    isLoading,
    loadError,
    reload,
  } = useDailyUpdatesList({ isAdminView });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activityDetail, setActivityDetail] =
    useState<DailyActivityItem | null>(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [selectedAgentUuid, setSelectedAgentUuid] = useState<string | null>(
    null,
  );
  const [detailError, setDetailError] = useState<string | null>(null);
  const [exportHint, setExportHint] = useState<string | null>(null);

  const isNewUpdateBlocked = isWeekendInTimeZone();
  const showNewButton = showCreateButton && !isAdmin;

  async function handleRowClick(id: string) {
    setDetailError(null);
    setIsDetailModalOpen(true);
    setIsDetailLoading(true);
    setActivityDetail(null);

    try {
      const { daily_activity } = await fetchDailyActivityById(id);
      setActivityDetail(daily_activity);
    } catch (error) {
      setDetailError(
        getApiErrorMessage(error, 'Unable to load daily update details.'),
      );
      setIsDetailModalOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  }

  function handleCloseDetailModal() {
    setIsDetailModalOpen(false);
    setActivityDetail(null);
  }

  function handleAgentClick(agentUuid: string) {
    setSelectedAgentUuid(agentUuid);
    setIsAgentModalOpen(true);
  }

  function handleCloseAgentModal() {
    setIsAgentModalOpen(false);
    setSelectedAgentUuid(null);
  }

  function handleSelectActivityFromAgent(activityId: string) {
    setIsAgentModalOpen(false);
    void handleRowClick(activityId);
  }

  function handleActivityUpdated(updated: DailyActivityItem) {
    setActivityDetail(updated);
    void reload();
  }

  function handleExport() {
    if (dailyUpdates.length === 0) {
      setExportHint('No daily updates available to export yet.');
      return;
    }

    setExportHint(null);

    const headers: CsvHeader[] = [
      { name: 'Agent Name', accessor: 'agentName' },
      { name: 'Plan', accessor: 'plan' },
      { name: 'Location', accessor: 'location' },
      { name: 'Applications Count', accessor: 'applicationsCount' },
      { name: 'Loan Amount (GHS)', accessor: 'loanAmount' },
      { name: 'Status', accessor: 'status' },
      { name: 'Date', accessor: 'date' },
    ];

    generateAndDownloadCsv({
      headers,
      data: dailyUpdates,
      fileName: `daily-updates-${isAdmin ? 'all-agents' : 'mine'}-${new Date().toISOString().slice(0, 10)}`,
    });
  }

  const emptyMessage = isAdmin
    ? 'No agent daily updates found for this period.'
    : 'No daily updates found yet. Click + New Daily Update to create one.';

  return (
    <>
      <AgentProfileModal
        isOpen={isAgentModalOpen}
        agentUuid={selectedAgentUuid}
        onClose={handleCloseAgentModal}
        onSelectActivity={handleSelectActivityFromAgent}
      />
      <DailyActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        activity={activityDetail}
        isLoading={isDetailLoading}
        onActivityUpdated={handleActivityUpdated}
      />

      <section className="rounded-xl bg-white p-4 md:p-6">
        <div className="flex items-center justify-between gap-3 lg:gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-neutral-grey-600 md:text-2xl">
              <span className="md:hidden">{mobileTitle ?? title}</span>
              <span className="hidden md:inline">{title}</span>
            </h1>
            {subtitle ? (
              <p className="mt-1 hidden text-sm text-neutral-grey-500 md:block">
                {subtitle}
              </p>
            ) : null}
          </div>
          {showNewButton ? (
            isNewUpdateBlocked ? (
              <span
                className="inline-flex shrink-0 cursor-not-allowed items-center justify-center rounded-lg bg-neutral-grey-200 px-3 py-2 text-sm font-semibold text-neutral-grey-500 md:px-4"
                title="Daily updates are only available Monday–Friday (Ghana time)."
              >
                <span className="md:hidden">New</span>
                <span className="hidden md:inline">+ New Daily Update</span>
              </span>
            ) : (
              <Link
                to={ROUTES.user.dashboard.newDailyApplicationUpdate}
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#fc9b1e] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#e68912] md:px-4"
              >
                <span className="md:hidden">+ New</span>
                <span className="hidden md:inline">+ New Daily Update</span>
              </Link>
            )
          ) : null}
        </div>
      </section>

      <DailyUpdatesSummary stats={summaryStats} />

      {!isAdmin ? (
        <AgentPerformanceChart
          data={performanceChartData}
          dateFilter={dateFilter}
          isLoading={isLoading}
        />
      ) : null}

      {loadError ? (
        <FormAlert className="rounded-xl">{loadError}</FormAlert>
      ) : null}

      {detailError ? (
        <FormAlert className="rounded-xl">{detailError}</FormAlert>
      ) : null}

      <section className="rounded-xl bg-white">
        <div className="flex flex-col gap-2 border-b border-neutral-grey-100 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-4">
          <h2 className="text-base font-semibold text-neutral-grey-600 md:text-lg">
            <span className="md:hidden">{mobileRecentHeading}</span>
            <span className="hidden md:inline">{recentHeading}</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {(['today', 'week', 'all'] as DateFilterPreset[]).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setExportHint(null);
                  setDateFilter(preset);
                }}
                className={filterButtonClass(dateFilter === preset)}
              >
                {preset === 'today'
                  ? 'Today'
                  : preset === 'week'
                    ? 'This Week'
                    : 'All'}
              </button>
            ))}
            <button
              type="button"
              onClick={handleExport}
              className="rounded-lg border border-neutral-grey-200 px-3 py-1.5 text-xs font-medium text-neutral-grey-500 hover:bg-neutral-grey-100"
            >
              Export
            </button>
          </div>
        </div>

        {exportHint ? (
          <div className="border-b border-neutral-grey-100 px-3 pb-3 sm:px-4">
            <FormAlert variant="info">{exportHint}</FormAlert>
          </div>
        ) : null}

        <div className="space-y-2.5 p-3 md:hidden">
          {isLoading ? (
            <p className="py-6 text-sm text-neutral-grey-500">
              Loading daily updates...
            </p>
          ) : null}
          {!isLoading && dailyUpdates.length === 0 ? (
            <p className="py-6 text-sm text-neutral-grey-500">{emptyMessage}</p>
          ) : null}
          {!isLoading &&
            dailyUpdates.map((item) => (
              <DailyUpdateCard
                key={item.id}
                agentName={item.agentName}
                location={item.location}
                applicationsCount={item.applicationsCount}
                loanAmount={item.loanAmount}
                status={item.status}
                statusClassName={statusStyles[item.status]}
                date={item.date}
                onClick={() => void handleRowClick(item.id)}
                onViewAgent={
                  isAdmin && item.agentUuid
                    ? () => handleAgentClick(item.agentUuid!)
                    : undefined
                }
              />
            ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-neutral-grey-100">
            <thead className="bg-neutral-grey-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                  Agent
                </th>
                {!isAdmin ? (
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                    Plan
                  </th>
                ) : null}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                  Apps
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                  Loan Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-grey-100 bg-white">
              {isLoading ? (
                <tr>
                  <td
                    className="px-4 py-6 text-sm text-neutral-grey-500"
                    colSpan={isAdmin ? 6 : 7}
                  >
                    Loading daily updates...
                  </td>
                </tr>
              ) : null}
              {!isLoading && dailyUpdates.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-6 text-sm text-neutral-grey-500"
                    colSpan={isAdmin ? 6 : 7}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : null}
              {!isLoading &&
                dailyUpdates.map((item) => (
                  <tr
                    key={item.id}
                    className="cursor-pointer transition hover:bg-neutral-grey-50"
                    onClick={() => void handleRowClick(item.id)}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {isAdmin && item.agentUuid ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAgentClick(item.agentUuid!);
                          }}
                          className="font-medium text-[#175cd3] hover:underline"
                        >
                          {item.agentName}
                        </button>
                      ) : (
                        <span className="font-medium text-neutral-grey-600">
                          {item.agentName}
                        </span>
                      )}
                    </td>
                    {!isAdmin ? (
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-grey-500">
                        {item.plan}
                      </td>
                    ) : null}
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-grey-500">
                      {item.location}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-grey-500">
                      {item.applicationsCount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-neutral-grey-600">
                      GHS {item.loanAmount.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[item.status]}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-grey-500">
                      {item.date}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
