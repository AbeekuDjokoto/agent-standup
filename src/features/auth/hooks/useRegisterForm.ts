import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useToast } from '@/hooks';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { ROUTES } from '@/utils/route-constants';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/pages/Register/registerSchema';
import { registerUser } from '@/services/authService';

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
      locationStation: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser({
        full_name: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        location_station: values.locationStation,
      });

      toast.success('Account created successfully. Please log in.');
      navigate(ROUTES.user.auth.login);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Unable to create account. Please try again.'),
      );
    }
  }

  return {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
  };
}
