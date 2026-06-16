import { useId, useMemo, useState } from 'react';

import type { DateFilterPreset } from '@/features/dashboard/hooks/useDailyUpdatesList';
import type { PerformanceChartPoint } from '@/features/dashboard/utils/buildPerformanceChartData';

type ChartMetric = 'applications' | 'loans' | 'both';

type AgentPerformanceChartProps = {
  data: PerformanceChartPoint[];
  dateFilter: DateFilterPreset;
  isLoading?: boolean;
};

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;
const PADDING = { top: 16, right: 48, bottom: 36, left: 40 };

function filterLabel(preset: DateFilterPreset): string {
  if (preset === 'today') return 'Today';
  if (preset === 'week') return 'This week';
  return 'All time';
}

function metricButtonClass(active: boolean) {
  return `rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
    active
      ? 'border-[#fc9b1e] bg-[#fff7ed] text-[#c2410c]'
      : 'border-neutral-grey-200 text-neutral-grey-500 hover:bg-neutral-grey-100'
  }`;
}

function formatLoanAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(Math.round(value));
}

export function AgentPerformanceChart({
  data,
  dateFilter,
  isLoading = false,
}: AgentPerformanceChartProps) {
  const chartTitleId = useId();
  const [metric, setMetric] = useState<ChartMetric>('both');

  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const chart = useMemo(() => {
    if (data.length === 0) {
      return null;
    }

    const maxApplications = Math.max(
      ...data.map((point) => point.applications),
      1,
    );
    const maxLoanAmount = Math.max(...data.map((point) => point.loanAmount), 1);
    const groupWidth = plotWidth / data.length;
    const barWidth = Math.min(28, groupWidth * 0.42);

    const points = data.map((point, index) => {
      const centerX = PADDING.left + groupWidth * index + groupWidth / 2;
      const applicationsHeight =
        (point.applications / maxApplications) * plotHeight;
      const loanHeight = (point.loanAmount / maxLoanAmount) * plotHeight;

      return {
        ...point,
        centerX,
        applicationsY: PADDING.top + plotHeight - applicationsHeight,
        applicationsHeight,
        loanY: PADDING.top + plotHeight - loanHeight,
        loanHeight,
      };
    });

    const linePath = points
      .map((point, index) => {
        const command = index === 0 ? 'M' : 'L';
        return `${command} ${point.centerX} ${point.loanY}`;
      })
      .join(' ');

    return {
      maxApplications,
      maxLoanAmount,
      barWidth,
      points,
      linePath,
    };
  }, [data, plotHeight, plotWidth]);

  const showApplications = metric === 'applications' || metric === 'both';
  const showLoans = metric === 'loans' || metric === 'both';

  return (
    <section
      className="rounded-xl bg-white p-4 md:p-6"
      aria-labelledby={chartTitleId}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id={chartTitleId}
            className="text-base font-semibold text-neutral-grey-600 md:text-lg"
          >
            Performance trend
          </h2>
          <p className="mt-1 text-sm text-neutral-grey-500">
            Daily applications and loan volume · {filterLabel(dateFilter)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={metricButtonClass(metric === 'both')}
            onClick={() => setMetric('both')}
          >
            Both
          </button>
          <button
            type="button"
            className={metricButtonClass(metric === 'applications')}
            onClick={() => setMetric('applications')}
          >
            Applications
          </button>
          <button
            type="button"
            className={metricButtonClass(metric === 'loans')}
            onClick={() => setMetric('loans')}
          >
            Loan amount
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-neutral-grey-500">
        {showApplications ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#fc9b1e]" />
            Applications (count)
          </span>
        ) : null}
        {showLoans ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-0.5 w-4 bg-[#175cd3]" />
            Loan amount (GHS)
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <p className="mt-8 py-10 text-center text-sm text-neutral-grey-500">
          Loading performance data...
        </p>
      ) : null}

      {!isLoading && !chart ? (
        <p className="mt-8 py-10 text-center text-sm text-neutral-grey-500">
          Submit daily updates to see your performance trend here.
        </p>
      ) : null}

      {!isLoading && chart ? (
        <div className="mt-4 overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="min-w-[320px] w-full"
            role="img"
            aria-label="Agent performance chart showing applications and loan amount by day"
          >
            <line
              x1={PADDING.left}
              y1={PADDING.top + plotHeight}
              x2={PADDING.left + plotWidth}
              y2={PADDING.top + plotHeight}
              stroke="#e5e7eb"
            />
            <line
              x1={PADDING.left}
              y1={PADDING.top}
              x2={PADDING.left}
              y2={PADDING.top + plotHeight}
              stroke="#e5e7eb"
            />

            {showLoans ? (
              <line
                x1={PADDING.left + plotWidth}
                y1={PADDING.top}
                x2={PADDING.left + plotWidth}
                y2={PADDING.top + plotHeight}
                stroke="#e5e7eb"
              />
            ) : null}

            <text
              x={PADDING.left - 8}
              y={PADDING.top + 4}
              textAnchor="end"
              className="fill-neutral-grey-400 text-[10px]"
            >
              {chart.maxApplications}
            </text>
            <text
              x={PADDING.left - 8}
              y={PADDING.top + plotHeight}
              textAnchor="end"
              className="fill-neutral-grey-400 text-[10px]"
            >
              0
            </text>

            {showLoans ? (
              <>
                <text
                  x={PADDING.left + plotWidth + 8}
                  y={PADDING.top + 4}
                  textAnchor="start"
                  className="fill-neutral-grey-400 text-[10px]"
                >
                  {formatLoanAxis(chart.maxLoanAmount)}
                </text>
                <text
                  x={PADDING.left + plotWidth + 8}
                  y={PADDING.top + plotHeight}
                  textAnchor="start"
                  className="fill-neutral-grey-400 text-[10px]"
                >
                  0
                </text>
              </>
            ) : null}

            {showApplications
              ? chart.points.map((point) => (
                  <g key={`${point.reportingDate}-bar`}>
                    <rect
                      x={point.centerX - chart.barWidth / 2}
                      y={point.applicationsY}
                      width={chart.barWidth}
                      height={point.applicationsHeight}
                      rx={4}
                      fill="#fc9b1e"
                    >
                      <title>
                        {point.dateLabel}: {point.applications} applications
                      </title>
                    </rect>
                  </g>
                ))
              : null}

            {showLoans ? (
              <>
                <path
                  d={chart.linePath}
                  fill="none"
                  stroke="#175cd3"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {chart.points.map((point) => (
                  <circle
                    key={`${point.reportingDate}-loan`}
                    cx={point.centerX}
                    cy={point.loanY}
                    r={4}
                    fill="#175cd3"
                  >
                    <title>
                      {point.dateLabel}: GHS {point.loanAmount.toLocaleString()}
                    </title>
                  </circle>
                ))}
              </>
            ) : null}

            {chart.points.map((point) => (
              <text
                key={`${point.reportingDate}-label`}
                x={point.centerX}
                y={PADDING.top + plotHeight + 18}
                textAnchor="middle"
                className="fill-neutral-grey-500 text-[10px]"
              >
                {point.dateLabel}
              </text>
            ))}
          </svg>
        </div>
      ) : null}
    </section>
  );
}
