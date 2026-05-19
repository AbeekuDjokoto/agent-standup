import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/hooks';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { getPostLoginPath, getUserRoles } from '@/utils/auth';
import { useAuthStore } from '@/stores';
import { loginUser } from '@/services/authService';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/pages/Login/loginSchema';

export function useLoginForm() {
  const toast = useToast();
  const navigate = useNavigate();
  const authenticateFromLoginResponse = useAuthStore(
    (state) => state.authenticateFromLoginResponse,
  );

  const {
    register,
    handleSubmit,
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
    try {
      const response = await loginUser({
        email: formValues.email.trim(),
        password: formValues.password,
      });

      const user = authenticateFromLoginResponse(response);
      const roles = getUserRoles(user);

      toast.success('Login successful.');
      navigate(getPostLoginPath(roles));
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to login. Please try again.'));
    }
  }

  return {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
  };
}
