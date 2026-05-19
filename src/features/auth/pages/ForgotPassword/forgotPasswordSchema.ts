import { z } from 'zod';

import { getRequiredEmailSchema } from '@/utils/schemas';

export const forgotPasswordSchema = z.object({
  email: getRequiredEmailSchema('Email address'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
