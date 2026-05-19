import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  type ForgotPasswordFormValues,
  forgotPasswordSchema,
} from '@/features/auth/pages/ForgotPassword/forgotPasswordSchema';
import { requestPasswordReset } from '@/services/authService';
import {
  getForgotPasswordSuccessMessage,
  getResetPasswordPathFromUrl,
} from '@/utils/auth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export function useForgotPasswordForm() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    clearErrors('root');

    try {
      const response = await requestPasswordReset({
        email: values.email.trim(),
      });

      const message = getForgotPasswordSuccessMessage(response);

      if (response.reset_url) {
        navigate(getResetPasswordPathFromUrl(response.reset_url));
        return;
      }

      setSuccessMessage(message);
      setIsSubmitted(true);
    } catch (error) {
      setError('root', {
        type: 'server',
        message: getApiErrorMessage(
          error,
          'Unable to send reset instructions. Please try again.',
        ),
      });
    }
  }

  return {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
    isSubmitted,
    successMessage,
  };
}
