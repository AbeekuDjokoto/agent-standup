import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/hooks';
import { ROUTES } from '@/utils/route-constants';
import {
  doCreateUserWithEmailAndPassword,
  doSendEmailVerification,
  doSignInWithGoogle,
} from '@/features/auth/hooks/auth';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/pages/Register/registerSchema';

export function useRegisterForm() {
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await doCreateUserWithEmailAndPassword(values.email.trim(), values.password);

      try {
        await doSendEmailVerification();
      } catch {
        // Non-blocking: registration succeeded even if email verification fails.
      }

      toast.success('Account created successfully.');
      navigate(ROUTES.user.dashboard.overview);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create account. Please try again.';
      toast.error(message);
    }
  }

  const onGoogleSignIn = async () => {
    try {
      await doSignInWithGoogle();
      toast.success('Signed up with Google.');
      navigate(ROUTES.user.dashboard.overview);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Google sign-up failed. Please try again.';
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
