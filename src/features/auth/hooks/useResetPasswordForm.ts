import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { resetPassword } from '@/services/authService';
import { useAuthStore } from '@/stores';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { ROUTES } from '@/utils/route-constants';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/pages/ResetPassword/resetPasswordSchema';

export function useResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    clearErrors('root');

    if (!token) {
      setError('root', {
        type: 'server',
        message: 'This reset link is invalid or has expired.',
      });
      return;
    }

    try {
      await resetPassword({
        token,
        password: values.password,
      });

      useAuthStore.getState().reset();
      navigate(ROUTES.user.auth.login, { replace: true });
    } catch (error) {
      setError('root', {
        type: 'server',
        message: getApiErrorMessage(
          error,
          'Unable to reset password. Please try again.',
        ),
      });
    }
  }

  return {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
    hasToken: Boolean(token),
  };
}
