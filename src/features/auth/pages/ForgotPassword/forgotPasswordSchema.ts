import { getRequiredEmailSchema } from '@/utils/schemas';
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: getRequiredEmailSchema('Email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
