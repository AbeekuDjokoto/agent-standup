import { useEffect, useMemo, useState } from 'react';
import { NavigationBar } from '@/features/dashboard/components/Navigation';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/route-constants';
import { fetchAgentRecords } from '@/services/agentService';
import { useAuth } from '@/context/authContext';
import { useToast } from '@/hooks';
import { generateAndDownloadCsv, type CsvHeader } from '@/utils/generateAndDownloadCsv';

type DailyUpdateRecord = {
  id: string;
  agentName: string;
  plan: string;
  location: string;
  applicationsCount: number;
  commission: number;
  status: 'Submitted' | 'Approved' | 'Pending';
  date: string;
};

const statusStyles: Record<DailyUpdateRecord['status'], string> = {
  Approved: 'bg-[#ecfdf3] text-[#067647] ring-[#abefc6]',
  Submitted: 'bg-[#eff8ff] text-[#175cd3] ring-[#b2ddff]',
  Pending: 'bg-[#fffaeb] text-[#b54708] ring-[#fedf89]',
};

type FirestoreTimestamp = {
  toDate: () => Date;
};

function isFirestoreTimestamp(value: unknown): value is FirestoreTimestamp {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as FirestoreTimestamp).toDate === 'function'
  );
}

function formatDate(value: unknown): string {
  if (isFirestoreTimestamp(value)) {
    return value.toDate().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  if (typeof value === 'string' && value) {
    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  }

  return '-';
}

function isFirebaseIndexError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'failed-precondition'
  );
}

export const DailyApplicationUpdates = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [dailyUpdates, setDailyUpdates] = useState<DailyUpdateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDailyUpdates() {
      if (!currentUser?.uid) {
        setDailyUpdates([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const records = await fetchAgentRecords(currentUser.uid);
        console.log('Fetched daily updates records:', records);

        const normalizedRecords: DailyUpdateRecord[] = records.map((record) => {
          const rawStatus = String(record.status ?? 'Submitted');
          const normalizedStatus: DailyUpdateRecord['status'] =
            rawStatus === 'Approved' || rawStatus === 'Pending'
              ? rawStatus
              : 'Submitted';

          return {
            id: record.id,
            agentName: String(record.fullName ?? 'Unknown Agent'),
            plan: String(record.plan ?? 'Daily Update'),
            location: String(record.location ?? '-'),
            applicationsCount: Number(record.applicationsCount ?? 0),
            commission: Number(record.totalAmount ?? 0),
            status: normalizedStatus,
            date: formatDate(record.updateDate ?? record.createdAt),
          };
        });

        setDailyUpdates(normalizedRecords);
      } catch (error) {
        // Keep full raw error available in dev tools even if toast truncates.
        console.error('Failed to fetch daily updates:', error);

        if (isFirebaseIndexError(error)) {
          toast.error(
            'Firestore index required. Open Firebase Console -> Firestore Database -> Indexes and create the suggested composite index for agentUid + createdAt.',
          );
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Unable to fetch daily updates right now.';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadDailyUpdates();
  }, [currentUser?.uid, toast]);

  const totalApplications = useMemo(
    () => dailyUpdates.reduce((sum, update) => sum + update.applicationsCount, 0),
    [dailyUpdates],
  );

  const totalCommissions = useMemo(
    () => dailyUpdates.reduce((sum, update) => sum + update.commission, 0),
    [dailyUpdates],
  );

  function handleExport() {
    if (dailyUpdates.length === 0) {
      toast.info('No daily updates available to export yet.');
      return;
    }

    const headers: CsvHeader[] = [
      { name: 'Update ID', accessor: 'id' },
      { name: 'Agent Name', accessor: 'agentName' },
      { name: 'Plan', accessor: 'plan' },
      { name: 'Location', accessor: 'location' },
      { name: 'Applications Count', accessor: 'applicationsCount' },
      { name: 'Commission (GHS)', accessor: 'commission' },
      { name: 'Status', accessor: 'status' },
      { name: 'Date', accessor: 'date' },
    ];

    generateAndDownloadCsv({
      headers,
      data: dailyUpdates,
      fileName: `daily-updates-${new Date().toISOString().slice(0, 10)}`,
    });
  }

  return (
    <div className="min-h-screen bg-[#f9fafa] p-4">
      <NavigationBar />
      <main className="mt-4 space-y-4">
        <section className="rounded-xl bg-white p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-grey-600">
                Daily Application Updates
              </h1>
              <p className="mt-1 text-sm text-neutral-grey-500">
                Track all applications submitted by you and commissions earned.
              </p>
            </div>
            <Link
              to={ROUTES.user.dashboard.newDailyApplicationUpdate}
              className="inline-flex items-center justify-center rounded-lg bg-[#fc9b1e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e68912]"
            >
              + New Daily Update
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-grey-500">
              Total Updates
            </p>
            <p className="mt-2 text-3xl font-semibold text-neutral-grey-600">
              {dailyUpdates.length}
            </p>
          </article>
          <article className="rounded-xl bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-grey-500">
              Applications
            </p>
            <p className="mt-2 text-3xl font-semibold text-neutral-grey-600">
              {totalApplications}
            </p>
          </article>
          <article className="rounded-xl bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-grey-500">
              Commission Today
            </p>
            <p className="mt-2 text-3xl font-semibold text-neutral-grey-600">
              GHS {totalCommissions.toLocaleString()}
            </p>
          </article>
          <article className="rounded-xl bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-grey-500">
              Last Update
            </p>
            <p className="mt-2 text-3xl font-semibold text-neutral-grey-600">
              {dailyUpdates[0]?.date ?? '-'}
            </p>
          </article>
        </section>

        <section className="rounded-xl bg-white">
          <div className="flex flex-col gap-3 border-b border-neutral-grey-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-neutral-grey-600">
              Recent Daily Updates
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg border border-neutral-grey-200 px-3 py-1.5 text-xs font-medium text-neutral-grey-500 hover:bg-neutral-grey-100"
              >
                Today
              </button>
              <button
                type="button"
                className="rounded-lg border border-neutral-grey-200 px-3 py-1.5 text-xs font-medium text-neutral-grey-500 hover:bg-neutral-grey-100"
              >
                This Week
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="rounded-lg border border-neutral-grey-200 px-3 py-1.5 text-xs font-medium text-neutral-grey-500 hover:bg-neutral-grey-100"
              >
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-grey-100">
              <thead className="bg-neutral-grey-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                    Update ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                    Agent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                    Apps
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-grey-500">
                    Commission
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
                      colSpan={8}
                    >
                      Loading daily updates...
                    </td>
                  </tr>
                ) : null}
                {!isLoading && dailyUpdates.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-6 text-sm text-neutral-grey-500"
                      colSpan={8}
                    >
                      No daily updates found yet. Click <strong>+ New Daily Update</strong> to
                      create one.
                    </td>
                  </tr>
                ) : null}
                {!isLoading && dailyUpdates.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-neutral-grey-600">
                      {item.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-grey-600">
                      {item.agentName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-grey-500">
                      {item.plan}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-grey-500">
                      {item.location}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-grey-500">
                      {item.applicationsCount}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-neutral-grey-600">
                      GHS {item.commission.toLocaleString()}
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
      </main>
    </div>
  );
};
