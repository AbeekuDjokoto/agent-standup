import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { FormAlert } from '@/components/FormAlert';
import { FormAlert } from '@/components/FormAlert';
import { useAgentProfileActivity } from '@/features/dashboard/hooks/useAgentProfileActivity';
import type { DateFilterPreset } from '@/features/dashboard/hooks/useDailyUpdatesList';
import { getAuthDisplayName } from '@/utils/auth';

type AgentProfileModalProps = {
  isOpen: boolean;
  agentUuid: string | null;
  onClose: () => void;
  onSelectActivity: (activityId: string) => void;
};

function filterButtonClass(active: boolean) {
  return `rounded-lg border px-3 py-1.5 text-xs font-medium ${
    active
      ? 'border-[#fc9b1e] bg-[#fff7ed] text-[#c2410c]'
      : 'border-neutral-grey-200 text-neutral-grey-500 hover:bg-neutral-grey-100'
  }`;
}

export function AgentProfileModal({
  isOpen,
  agentUuid,
  onClose,
  onSelectActivity,
}: AgentProfileModalProps) {
  const {
    agent,
    updates,
    summaryStats,
    dateFilter,
    setDateFilter,
    isLoading,
    loadError,
  } = useAgentProfileActivity(isOpen ? agentUuid : null);

  const displayName = agent ? getAuthDisplayName(agent) : '';

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={(open) => {
        if (!open) onClose();
      }}
      position="side"
      title="Agent profile"
      showClose
    >
      <div className="flex flex-col gap-6 p-6">
        {isLoading ? (
          <p className="text-sm text-neutral-grey-500">Loading agent profile...</p>
        ) : null}

        {loadError ? <FormAlert>{loadError}</FormAlert> : null}

        {!isLoading && agent ? (
          <>
            <div className="rounded-xl border border-neutral-grey-100 bg-neutral-grey-50 p-4">
              <p className="text-lg font-semibold text-neutral-grey-600">
                {displayName}
              </p>
              <p className="mt-1 text-sm text-neutral-grey-500">{agent.email}</p>
              <p className="mt-2 text-sm text-neutral-grey-600">
                <span className="font-medium text-neutral-grey-500">Station: </span>
                {agent.location_station || '-'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {summaryStats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-xl border border-neutral-grey-100 bg-white p-3"
                >
                  <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-grey-500">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-neutral-grey-600">
                    {stat.value}
                  </p>
                </article>
              ))}
            </div>

            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                {(['today', 'week', 'all'] as DateFilterPreset[]).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDateFilter(preset)}
                    className={filterButtonClass(dateFilter === preset)}
                  >
                    {preset === 'today'
                      ? 'Today'
                      : preset === 'week'
                        ? 'This Week'
                        : 'All'}
                  </button>
                ))}
              </div>

              <h3 className="mb-2 text-sm font-semibold text-neutral-grey-600">
                Activity log
              </h3>

              {updates.length === 0 ? (
                <p className="text-sm text-neutral-grey-500">
                  No daily updates for this period.
                </p>
              ) : (
                <ul className="divide-y divide-neutral-grey-100 rounded-xl border border-neutral-grey-100">
                  {updates.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onSelectActivity(item.id)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-neutral-grey-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-neutral-grey-600">
                            {item.date}
                          </p>
                          <p className="text-xs text-neutral-grey-500">
                            {item.location} · {item.applicationsCount} apps
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-neutral-grey-600">
                          GHS {item.loanAmount.toLocaleString()}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : null}

        {!isLoading && !agent && agentUuid ? (
          <p className="text-sm text-neutral-grey-500">
            Agent not found or this account is not an agent.
          </p>
        ) : null}

        <Button type="button" variant="outline" className="w-full" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
