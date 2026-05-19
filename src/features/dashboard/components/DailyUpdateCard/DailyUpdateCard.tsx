import type { KeyboardEvent } from 'react';

type DailyUpdateCardProps = {
  agentName: string;
  location: string;
  applicationsCount: number;
  loanAmount: number;
  status: string;
  date: string;
  statusClassName: string;
  onClick: () => void;
  onViewAgent?: () => void;
};

export function DailyUpdateCard({
  agentName,
  location,
  applicationsCount,
  loanAmount,
  status,
  date,
  statusClassName,
  onClick,
  onViewAgent,
}: DailyUpdateCardProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="w-full cursor-pointer rounded-xl border border-neutral-grey-100 bg-white p-4 text-left shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] transition hover:border-neutral-grey-200 hover:bg-neutral-grey-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {onViewAgent ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onViewAgent();
              }}
              className="truncate text-left text-sm font-semibold text-[#175cd3] hover:underline"
            >
              {agentName}
            </button>
          ) : (
            <p className="truncate text-sm font-semibold text-neutral-grey-600">
              {agentName}
            </p>
          )}
          <p className="mt-0.5 truncate text-xs text-neutral-grey-500">
            {location}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClassName}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-neutral-grey-100 pt-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-grey-500">
            Apps
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-grey-600">
            {applicationsCount}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-grey-500">
            Loan
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-grey-600">
            GHS {loanAmount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-grey-500">
            Date
          </p>
          <p className="mt-1 text-sm font-semibold text-neutral-grey-600">{date}</p>
        </div>
      </div>
    </div>
  );
}
