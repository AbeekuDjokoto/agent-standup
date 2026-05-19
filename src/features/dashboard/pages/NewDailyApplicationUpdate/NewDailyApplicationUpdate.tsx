import { Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/Button';
import { DateInput } from '@/components/DateInput/DateInput';
import { FormAlert } from '@/components/FormAlert';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { LOCATION_OPTIONS } from '@/data/locationOptions';
import { NavigationBar } from '@/features/dashboard/components/Navigation';
import {
  dashboardMainClassName,
  dashboardPageClassName,
} from '@/features/dashboard/dashboardPageStyles';
import { useNewDailyApplicationUpdateForm } from '@/features/dashboard/hooks';
import { ROUTES } from '@/utils/route-constants';

export const NewDailyApplicationUpdate = () => {
  const navigate = useNavigate();

  const {
    register,
    control,
    formState: { errors, isSubmitting, isValid },
    onFormSubmit,
    isWeekendBlocked,
  } = useNewDailyApplicationUpdateForm();

  return (
    <div className={dashboardPageClassName}>
      <NavigationBar />

      <main className={`${dashboardMainClassName} max-w-4xl`}>
        <section className="rounded-xl bg-white p-4 sm:p-6">
          <button
            type="button"
            onClick={() =>
              navigate(ROUTES.user.dashboard.dailyApplicationUpdates)
            }
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
              Capture today&apos;s application performance and commission
              details.
            </p>
          </div>

          {isWeekendBlocked ? (
            <div
              className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
              role="status"
            >
              New daily updates are only available Monday–Friday (Ghana time).
              Please come back on the next business day.
            </div>
          ) : null}

          <form className="grid gap-4 md:grid-cols-2" onSubmit={onFormSubmit}>
            {errors.root?.message ? (
              <FormAlert className="md:col-span-2">
                {errors.root.message}
              </FormAlert>
            ) : null}
            <Input
              label="Agent Full Name"
              placeholder="e.g. Abeeku Djokoto"
              error={errors.fullName?.message}
              disabled
              {...register('fullName', { disabled: true })}
            />

            <Select
              id="location"
              label="Location"
              error={errors.location?.message}
              disabled
              {...register('location', { disabled: true })}
            >
              <option value="">Select location</option>
              {LOCATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>

            <Input
              label="Applications Count"
              type="number"
              min={0}
              placeholder="e.g. 12"
              error={errors.applicationsCount?.message}
              {...register('applicationsCount', { disabled: isWeekendBlocked })}
            />

            <Input
              label="Loan Amount (GHS)"
              type="number"
              min={0}
              step="0.01"
              placeholder="e.g. 15000.00"
              error={errors.totalAmount?.message}
              {...register('totalAmount', { disabled: isWeekendBlocked })}
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
                  disabled={isWeekendBlocked}
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
                disabled={isWeekendBlocked || !isValid || isSubmitting}
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
