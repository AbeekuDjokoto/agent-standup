import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/hooks';
import { ROUTES } from '@/utils/route-constants';
import { doPasswordReset, doSignInWithGoogle } from '@/features/auth/hooks/auth';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/pages/ForgotPassword/forgotPasswordSchema';

export function useForgotPasswordForm() {
  const toast = useToast();
  const navigate = useNavigate();

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
      await doPasswordReset(values.email.trim());
      toast.success('Password reset email sent. Check your inbox.');
      navigate(ROUTES.user.auth.login);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to send reset email. Please try again.';
      toast.error(message);
    }
  }

  const onGoogleSignIn = async () => {
    try {
      await doSignInWithGoogle();
      toast.success('Signed in with Google.');
      navigate(ROUTES.user.dashboard.overview);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Google sign-in failed. Please try again.';
      toast.error(message);
    }
  };

  return {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
    onGoogleSignIn,
  };
}
