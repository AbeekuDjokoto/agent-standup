import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/hooks';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import {
  getForgotPasswordSuccessMessage,
  getResetPasswordPathFromUrl,
} from '@/utils/auth';
import { requestPasswordReset } from '@/services/authService';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/pages/ForgotPassword/forgotPasswordSchema';

export function useForgotPasswordForm() {
  const toast = useToast();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      const response = await requestPasswordReset({
        email: values.email.trim(),
      });

      const message = getForgotPasswordSuccessMessage(response);

      if (response.reset_url) {
        toast.success(message);
        navigate(getResetPasswordPathFromUrl(response.reset_url));
        return;
      }

      setSuccessMessage(message);
      setIsSubmitted(true);
      toast.success(message);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Unable to send reset instructions. Please try again.'),
      );
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
