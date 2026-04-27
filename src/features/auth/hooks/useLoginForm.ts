import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useToast } from '@/hooks';
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from '@/features/auth/hooks/auth';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/pages/Login/loginSchema';

export function useLoginForm() {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: true,
    },
  });

  async function onSubmit(formValues: LoginFormValues) {
    const identifier = formValues.identifier.trim();
    const password = formValues.password;

    try {
      await doSignInWithEmailAndPassword(identifier, password);
      toast.success('Login successful.');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to login. Please try again.';
      toast.error(message);
    }
  }

  const onGoogleSignIn = async () => {
    try {
      await doSignInWithGoogle();
      toast.success('Signed in with Google.');
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
    formState: { errors, isValid, isDirty, isSubmitting },
    handleSubmit,
    onSubmit,
    onGoogleSignIn,
  };
}
