import { Link, useNavigate } from 'react-router-dom';
import { Controller } from 'react-hook-form';

import { NavigationBar } from '@/features/dashboard/components/Navigation';
import { Button } from '@/components/Button';
import { DateInput } from '@/components/DateInput/DateInput';
import { Input } from '@/components/Input';
import { LOCATION_OPTIONS } from '@/data/locationOptions';
import { ROUTES } from '@/utils/route-constants';
import { useNewDailyApplicationUpdateForm } from '@/features/dashboard/hooks';

export const NewDailyApplicationUpdate = () => {
  const navigate = useNavigate();

  const {
    register,
    control,
    formState: { errors, isSubmitting, isValid },
    onFormSubmit,
  } = useNewDailyApplicationUpdateForm();

  return (
    <div className="min-h-screen bg-[#f9fafa] p-4">
      <NavigationBar />

      <main className="mx-auto mt-4 max-w-4xl">
        <section className="rounded-xl bg-white p-6">
          <button
            type="button"
            onClick={() => navigate(ROUTES.user.dashboard.dailyApplicationUpdates)}
            className="mb-5 inline-flex items-center gap-2 rounded-lg border border-neutral-grey-200 px-3 py-2 text-sm font-medium text-neutral-grey-600 transition hover:bg-neutral-grey-100"
          >
            <span aria-hidden="true">←</span>
            Back
          </button>

          <div className="mb-6 flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-neutral-grey-600">
              New Daily Update
            </h1>
            <p className="text-sm text-neutral-grey-500">
              Capture today&apos;s application performance and commission details.
            </p>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={onFormSubmit}>
            <Input
              label="Agent Full Name"
              placeholder="e.g. Abeeku Djokoto"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <div className="space-y-1.5">
              <label
                htmlFor="location"
                className="text-sm font-medium text-neutral-grey-600"
              >
                Location
              </label>
              <select
                id="location"
                className="h-[42px] w-full rounded-[10px] border border-neutral-grey-100 bg-white px-3 text-sm text-neutral-grey-600 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] outline-none focus:border-brand-primary"
                {...register('location')}
              >
                <option value="">Select location</option>
                {LOCATION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.location?.message ? (
                <p className="text-xs text-semantics-red">{errors.location.message}</p>
              ) : null}
            </div>

            <Input
              label="Applications Count"
              type="number"
              min={0}
              placeholder="0"
              error={errors.applicationsCount?.message}
              {...register('applicationsCount')}
            />

            <Input
              label="Commission Amount (GHS)"
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              error={errors.totalAmount?.message}
              {...register('totalAmount')}
            />

            <Controller
              control={control}
              name="updateDate"
              render={({ field }) => (
                <DateInput
                  id="updateDate"
                  label="Update Date"
                  value={field.value}
                  onChange={(date) =>
                    field.onChange(date instanceof Date ? date : null)
                  }
                  error={errors.updateDate?.message}
                  innerClassName="h-[42px] rounded-[10px] border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]"
                />
              )}
            />

            <div className="md:col-span-2 mt-2 flex flex-wrap items-center justify-end gap-3">
              <Button
                as={Link}
                to={ROUTES.user.dashboard.dailyApplicationUpdates}
                variant="outline"
                size="medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="medium"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              >
                Save Daily Update
              </Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};
