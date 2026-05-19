import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import { FormAlert } from '@/components/FormAlert';
import { Input } from '@/components/Input';
import { inviteAdmin } from '@/services/adminService';
import type { AdminInviteResponse } from '@/types/admin';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import {
  adminInviteSchema,
  type AdminInviteFormValues,
} from './adminInviteSchema';

export function AdminInviteSection() {
  const [lastInvite, setLastInvite] = useState<AdminInviteResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AdminInviteFormValues>({
    resolver: zodResolver(adminInviteSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  async function onSubmit(values: AdminInviteFormValues) {
    setSubmitError(null);

    try {
      const response = await inviteAdmin({ email: values.email });
      setLastInvite(response);
      reset({ email: '' });
    } catch (error) {
      const apiError = error as { status?: number; message?: string };
      if (apiError.status === 409) {
        setSubmitError(
          apiError.message ||
            'This email already belongs to an administrator account.',
        );
        return;
      }

      setSubmitError(
        getApiErrorMessage(error, 'Unable to send invitation. Please try again.'),
      );
    }
  }

  return (
    <section className="min-w-0 rounded-xl bg-white p-4 md:p-6">
      <div className="max-w-xl min-w-0">
        <h2 className="text-lg font-semibold text-neutral-grey-600 md:text-xl">
          Invite administrator
        </h2>
        <p className="mt-1 break-words text-sm text-neutral-grey-500">
          Send an email invitation to grant admin access. Prior unconsumed invites
          for the same address are replaced.
        </p>
      </div>

      <form
        className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="user@example.com"
          className="min-w-0 flex-1"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button
          type="submit"
          variant="primary"
          className="sm:mt-7 sm:shrink-0"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send invite'}
        </Button>
      </form>

      {submitError ? (
        <FormAlert className="mt-3">{submitError}</FormAlert>
      ) : null}

      {lastInvite ? (
        <p className="mt-4 rounded-lg border border-[#b2ddff] bg-[#eff8ff] px-4 py-3 text-sm text-[#175cd3]">
          Invitation queued for <strong>{lastInvite.email}</strong>
          {lastInvite.expires_at ? (
            <>
              {' '}
              (expires{' '}
              {dayjs(lastInvite.expires_at).format('DD MMM YYYY, HH:mm')})
            </>
          ) : null}
          . {lastInvite.message}
        </p>
      ) : null}
    </section>
  );
}
