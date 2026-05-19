import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  acceptAdminInviteNewUserSchema,
  type AcceptAdminInviteNewUserValues,
} from '@/features/auth/pages/AcceptAdminInvite/acceptAdminInviteSchema';
import { useToast } from '@/hooks';
import { acceptAdminInvite } from '@/services/authService';
import { useAuthStore } from '@/stores';
import { getPostLoginPath, getUserRoles } from '@/utils/auth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export type AcceptAdminInviteMode = 'existing' | 'new';

export function useAcceptAdminInviteForm() {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  const authenticateFromLoginResponse = useAuthStore(
    (state) => state.authenticateFromLoginResponse,
  );

  const [mode, setMode] = useState<AcceptAdminInviteMode>('existing');
  const [isAcceptingExisting, setIsAcceptingExisting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AcceptAdminInviteNewUserValues>({
    resolver: zodResolver(acceptAdminInviteNewUserSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      password: '',
      locationStation: '',
    },
  });

  function completeSession(response: Awaited<ReturnType<typeof acceptAdminInvite>>) {
    const user = authenticateFromLoginResponse(response);
    const roles = getUserRoles(user);
    toast.success('Administrator access granted. Welcome!');
    navigate(getPostLoginPath(roles), { replace: true });
  }

  async function acceptWithTokenOnly() {
    if (!token) {
      toast.error('Invitation link is invalid or missing a token.');
      return;
    }

    try {
      setIsAcceptingExisting(true);
      const response = await acceptAdminInvite({ token });
      completeSession(response);
    } catch (error) {
      const apiError = error as { status?: number; message?: string };
      if (apiError.status === 422) {
        toast.error(
          apiError.message ||
            'Additional details are required. Switch to “New account” and complete the form.',
        );
        setMode('new');
        return;
      }

      toast.error(
        getApiErrorMessage(
          error,
          'Unable to accept invitation. The link may have expired.',
        ),
      );
    } finally {
      setIsAcceptingExisting(false);
    }
  }

  async function onSubmitNewUser(values: AcceptAdminInviteNewUserValues) {
    if (!token) {
      toast.error('Invitation link is invalid or missing a token.');
      return;
    }

    try {
      const response = await acceptAdminInvite({
        token,
        password: values.password,
        full_name: values.fullName.trim(),
        location_station: values.locationStation,
      });
      completeSession(response);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          'Unable to complete administrator setup. Please try again.',
        ),
      );
    }
  }

  return {
    token,
    mode,
    setMode,
    register,
    errors,
    isValid,
    isSubmitting: isSubmitting || isAcceptingExisting,
    handleSubmit,
    onSubmitNewUser,
    acceptWithTokenOnly,
  };
}
