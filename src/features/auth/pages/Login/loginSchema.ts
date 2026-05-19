import { z } from 'zod';

import { getRequiredEmailSchema, getRequiredStringSchema } from '@/utils/schemas';

export const loginSchema = z.object({
  email: getRequiredEmailSchema('Email address'),
  password: getRequiredStringSchema('Password'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
