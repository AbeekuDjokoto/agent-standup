import { z } from 'zod';

import { LOCATION_OPTIONS } from '@/data/locationOptions';
import {
  getPasswordVerificationSchema,
  getRequiredEmailSchema,
  getRequiredStringSchema,
} from '@/utils/schemas';

export const registerSchema = z.object({
  fullName: getRequiredStringSchema('Full name'),
  email: getRequiredEmailSchema('Email address'),
  password: getPasswordVerificationSchema('Password'),
  locationStation: z
    .string()
    .min(1, 'Location station is required')
    .refine(
      (value) => (LOCATION_OPTIONS as readonly string[]).includes(value),
      'Select a valid location station',
    ),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
