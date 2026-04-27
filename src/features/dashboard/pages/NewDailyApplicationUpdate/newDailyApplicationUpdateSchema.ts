import {
  getNumericStringSchema,
  getRequiredDateSchema,
  getRequiredStringSchema,
} from '@/utils/schemas';
import { z } from 'zod';

export const newDailyApplicationUpdateSchema = z.object({
  fullName: getRequiredStringSchema('Agent full name'),
  location: getRequiredStringSchema('Location'),
  applicationsCount: getNumericStringSchema('Applications count'),
  totalAmount: getNumericStringSchema('Commission amount'),
  updateDate: getRequiredDateSchema('Update date'),
});

export type NewDailyApplicationUpdateValues = z.infer<
  typeof newDailyApplicationUpdateSchema
>;
