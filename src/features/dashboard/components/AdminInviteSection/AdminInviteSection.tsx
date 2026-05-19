import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/hooks';
import { inviteAdmin } from '@/services/adminService';
import type { AdminInviteResponse } from '@/types/admin';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

import {
  adminInviteSchema,
  type AdminInviteFormValues,
} from './adminInviteSchema';

export function AdminInviteSection() {
  const toast = useToast();
  const [lastInvite, setLastInvite] = useState<AdminInviteResponse | null>(null);

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
    try {
      const response = await inviteAdmin({ email: values.email });
      setLastInvite(response);
      toast.success(
        response.message || 'Administrator invitation sent successfully.',
      );
      reset({ email: '' });
    } catch (error) {
      const apiError = error as { status?: number; message?: string };
      if (apiError.status === 409) {
        toast.error(
          apiError.message ||
            'This email already belongs to an administrator account.',
        );
        return;
      }

      toast.error(
        getApiErrorMessage(error, 'Unable to send invitation. Please try again.'),
      );
    }
  }

  return (
    <section className="rounded-xl bg-white p-4 md:p-6">
      <div className="max-w-xl">
        <h2 className="text-lg font-semibold text-neutral-grey-600 md:text-xl">
          Invite administrator
        </h2>
        <p className="mt-1 text-sm text-neutral-grey-500">
          Send an email invitation to grant admin access. Prior unconsumed invites
          for the same address are replaced.
        </p>
      </div>

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="user@example.com"
          className="flex-1"
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
