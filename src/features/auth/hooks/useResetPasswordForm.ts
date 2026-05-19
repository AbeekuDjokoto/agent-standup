import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useToast } from '@/hooks';
import { resetPassword } from '@/services/authService';
import { useAuthStore } from '@/stores';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { ROUTES } from '@/utils/route-constants';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/pages/ResetPassword/resetPasswordSchema';

export function useResetPasswordForm() {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';

  const {
    register,
    handleSubmit,
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
    if (!token) {
      toast.error('This reset link is invalid or has expired.');
      return;
    }

    try {
      await resetPassword({
        token,
        password: values.password,
      });

      useAuthStore.getState().reset();
      toast.success('Your password has been updated. Please log in.');
      navigate(ROUTES.user.auth.login, { replace: true });
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Unable to reset password. Please try again.'),
      );
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
