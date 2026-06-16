import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  type RegisterFormValues,
  registerSchema,
} from '@/features/auth/pages/Register/registerSchema';
import { registerUser } from '@/services/authService';
import { useAuthStore } from '@/stores';
import {
  getPostLoginPath,
  getUserRoles,
  isAuthSessionValid,
} from '@/utils/auth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { ROUTES } from '@/utils/route-constants';

export function useRegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      locationStation: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    clearErrors('root');

    try {
      await registerUser({
        full_name: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        location_station: values.locationStation,
      });

      const session = useAuthStore.getState();

      if (isAuthSessionValid(session)) {
        navigate(getPostLoginPath(getUserRoles(session.user)), { replace: true });
        return;
      }

      navigate(ROUTES.user.auth.login, { replace: true });
    } catch (error) {
      setError('root', {
        type: 'server',
        message: getApiErrorMessage(
          error,
          'Unable to create account. Please try again.',
        ),
      });
    }
  }

  return {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
  };
}
