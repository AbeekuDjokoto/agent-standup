import { z } from 'zod';

import {
  getPasswordVerificationSchema,
  getRequiredEmailSchema,
  getRequiredStringSchema,
} from '@/utils/schemas';

export const registerSchema = z
  .object({
    fullName: getRequiredStringSchema('Full name'),
    email: getRequiredEmailSchema('Email address'),
    password: getPasswordVerificationSchema('Password'),
    confirmPassword: getRequiredStringSchema('Confirm password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
