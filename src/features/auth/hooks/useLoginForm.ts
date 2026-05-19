import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  type LoginFormValues,
  loginSchema,
} from '@/features/auth/pages/Login/loginSchema';
import { loginUser } from '@/services/authService';
import { useAuthStore } from '@/stores';
import { getPostLoginPath, getUserRoles } from '@/utils/auth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';

export function useLoginForm() {
  const navigate = useNavigate();
  const authenticateFromLoginResponse = useAuthStore(
    (state) => state.authenticateFromLoginResponse,
  );

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  async function onSubmit(formValues: LoginFormValues) {
    clearErrors('root');

    try {
      const response = await loginUser({
        email: formValues.email.trim(),
        password: formValues.password,
      });

      const user = authenticateFromLoginResponse(response);
      const roles = getUserRoles(user);

      navigate(getPostLoginPath(roles));
    } catch (error) {
      setError('root', {
        type: 'server',
        message: getApiErrorMessage(
          error,
          'Unable to login. Please try again.',
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
