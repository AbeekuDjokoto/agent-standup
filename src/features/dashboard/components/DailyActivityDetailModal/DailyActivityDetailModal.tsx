import { type ReactNode, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';

import { Button } from '@/components/Button';
import { DateInput } from '@/components/DateInput/DateInput';
import { FormAlert } from '@/components/FormAlert';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { updateDailyActivity } from '@/services/activityService';
import type { DailyActivityItem } from '@/types/activity';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import {
  editDailyActivitySchema,
  type EditDailyActivityValues,
} from './editDailyActivitySchema';

type DailyActivityDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  activity: DailyActivityItem | null;
  isLoading: boolean;
  onActivityUpdated?: (activity: DailyActivityItem) => void;
};

function formatDate(value: string | null | undefined): string {
  if (!value) return '-';
  const parsed = value.includes('T')
    ? dayjs(value)
    : dayjs(value, 'YYYY-MM-DD');
  return parsed.isValid() ? parsed.format('DD MMM YYYY') : '-';
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return '-';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD MMM YYYY, HH:mm') : '-';
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-neutral-grey-100 py-3 last:border-b-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-neutral-grey-500">
        {label}
      </dt>
      <dd className="text-sm text-neutral-grey-600">{value}</dd>
    </div>
  );
}

export function DailyActivityDetailModal({
  isOpen,
  onClose,
  activity,
  isLoading,
  onActivityUpdated,
}: DailyActivityDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EditDailyActivityValues>({
    resolver: zodResolver(editDailyActivitySchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (!activity) {
      setIsEditing(false);
      return;
    }

    reset({
      applications_count: activity.applications,
      loan_amount: activity.total_amount,
      update_date: dayjs(activity.date).toDate(),
    });
    setIsEditing(false);
    setSaveError(null);
  }, [activity, reset]);

  async function onSubmit(values: EditDailyActivityValues) {
    if (!activity) return;

    setSaveError(null);

    try {
      const { daily_activity } = await updateDailyActivity(activity.id, {
        applications_count: values.applications_count,
        loan_amount: values.loan_amount,
        update_date: dayjs(values.update_date).format('YYYY-MM-DD'),
      });

      onActivityUpdated?.(daily_activity);
      setIsEditing(false);
    } catch (error) {
      setSaveError(
        getApiErrorMessage(
          error,
          'Unable to save daily update. Please try again.',
        ),
      );
    }
  }

  function handleClose() {
    setIsEditing(false);
    setSaveError(null);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={(open) => {
        if (!open) handleClose();
      }}
      position="side"
      title={isEditing ? 'Edit daily update' : 'Daily update details'}
      showClose
    >
      <div className="p-6">
        {isLoading ? (
          <p className="text-sm text-neutral-grey-500">Loading details...</p>
        ) : null}

        {!isLoading && activity && !isEditing ? (
          <>
            <dl>
              <DetailRow label="Agent" value={activity.agent_full_name} />
              <DetailRow label="Location" value={activity.location} />
              <DetailRow label="Applications" value={activity.applications} />
              <DetailRow
                label="Loan amount"
                value={`GHS ${activity.total_amount.toLocaleString()}`}
              />
              <DetailRow
                label="Reporting date"
                value={formatDate(activity.date)}
              />
              <DetailRow
                label="Submitted"
                value={formatDateTime(activity.submitted)}
              />
              <DetailRow label="Status" value="Submitted" />
            </dl>

            <div className="mt-6 flex flex-col gap-2">
              <Button
                type="button"
                variant="primary"
                className="w-full"
                onClick={() => {
                  setSaveError(null);
                  setIsEditing(true);
                }}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </>
        ) : null}

        {!isLoading && activity && isEditing ? (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {saveError ? <FormAlert>{saveError}</FormAlert> : null}
            <Input
              label="Applications"
              type="number"
              min={0}
              step={1}
              error={errors.applications_count?.message}
              {...register('applications_count', { valueAsNumber: true })}
            />

            <Input
              label="Loan amount (GHS)"
              type="number"
              min={0}
              step="0.01"
              error={errors.loan_amount?.message}
              {...register('loan_amount', { valueAsNumber: true })}
            />

            <Controller
              control={control}
              name="update_date"
              render={({ field }) => (
                <DateInput
                  label="Reporting date"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.update_date?.message}
                />
              )}
            />

            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
                onClick={() => {
                  if (activity) {
                    reset({
                      applications_count: activity.applications,
                      loan_amount: activity.total_amount,
                      update_date: dayjs(activity.date).toDate(),
                    });
                  }
                  setSaveError(null);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : null}

        {!isLoading && !activity ? (
          <>
            <p className="text-sm text-neutral-grey-500">
              Unable to load this daily update.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-6 w-full"
              onClick={handleClose}
            >
              Close
            </Button>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
