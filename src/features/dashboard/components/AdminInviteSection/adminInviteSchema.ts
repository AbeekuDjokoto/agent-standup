import { z } from 'zod';

import { getRequiredEmailSchema } from '@/utils/schemas';

export const adminInviteSchema = z.object({
  email: getRequiredEmailSchema('Email address'),
});

export type AdminInviteFormValues = z.infer<typeof adminInviteSchema>;
