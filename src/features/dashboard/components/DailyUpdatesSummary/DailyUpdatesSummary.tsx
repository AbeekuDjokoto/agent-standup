type SummaryStat = {
  label: string;
  value: string;
};

type DailyUpdatesSummaryProps = {
  stats: SummaryStat[];
};

export function DailyUpdatesSummary({ stats }: DailyUpdatesSummaryProps) {
  return (
    <>
      <section className="md:hidden">
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="min-w-[calc(100%-1.5rem)] shrink-0 snap-center rounded-xl bg-white p-4 sm:min-w-[75%]"
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-grey-500">
                {stat.label}
              </p>
              <p className="mt-1.5 text-2xl font-semibold text-neutral-grey-600">
                {stat.value}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-xl bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-grey-500">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-neutral-grey-600">
              {stat.value}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}
