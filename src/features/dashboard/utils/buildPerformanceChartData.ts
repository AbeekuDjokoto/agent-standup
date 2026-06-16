import dayjs from 'dayjs';

import type { DailyUpdateRecord } from '@/features/dashboard/hooks/useDailyUpdatesList';

export type PerformanceChartPoint = {
  reportingDate: string;
  dateLabel: string;
  applications: number;
  loanAmount: number;
};

export function buildPerformanceChartData(
  updates: DailyUpdateRecord[],
): PerformanceChartPoint[] {
  const byDate = new Map<string, PerformanceChartPoint>();

  for (const update of updates) {
    const reportingDate = update.reportingDate;
    if (!reportingDate) continue;

    const existing = byDate.get(reportingDate);

    if (existing) {
      existing.applications += update.applicationsCount;
      existing.loanAmount += update.loanAmount;
      continue;
    }

    byDate.set(reportingDate, {
      reportingDate,
      dateLabel: dayjs(reportingDate).format('DD MMM'),
      applications: update.applicationsCount,
      loanAmount: update.loanAmount,
    });
  }

  return [...byDate.values()].sort((a, b) =>
    a.reportingDate.localeCompare(b.reportingDate),
  );
}
