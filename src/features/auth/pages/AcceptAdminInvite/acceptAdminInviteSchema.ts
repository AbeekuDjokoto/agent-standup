import { z } from 'zod';

import { LOCATION_OPTIONS } from '@/data/locationOptions';
import {
  getAdminInvitePasswordSchema,
  getRequiredStringSchema,
} from '@/utils/schemas';

export const acceptAdminInviteNewUserSchema = z.object({
  fullName: getRequiredStringSchema('Full name'),
  password: getAdminInvitePasswordSchema('Password'),
  locationStation: z
    .string()
    .min(1, 'Location station is required')
    .refine(
      (value) => (LOCATION_OPTIONS as readonly string[]).includes(value),
      'Select a valid location station',
    ),
});

export type AcceptAdminInviteNewUserValues = z.infer<
  typeof acceptAdminInviteNewUserSchema
>;
