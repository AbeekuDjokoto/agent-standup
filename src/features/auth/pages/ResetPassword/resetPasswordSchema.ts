import { z } from 'zod';

import { getPasswordVerificationSchema } from '@/utils/schemas';

export const resetPasswordSchema = z
  .object({
    password: getPasswordVerificationSchema('Password'),
    confirmPassword: z.string().trim().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
