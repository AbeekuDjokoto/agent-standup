import { getRequiredStringSchema } from '@/utils/schemas';
import { z } from 'zod';

export const loginSchema = z.object({
  identifier: getRequiredStringSchema('Email address or phone number'),
  password: getRequiredStringSchema('Password'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
