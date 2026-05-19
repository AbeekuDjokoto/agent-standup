import { z } from 'zod';

export const editDailyActivitySchema = z.object({
  applications_count: z.coerce
    .number()
    .int('Applications must be a whole number.')
    .min(0, 'Applications must be 0 or more.'),
  loan_amount: z.coerce
    .number()
    .min(0, 'Loan amount must be 0 or more.'),
  update_date: z.date({ error: 'Reporting date is required.' }),
});

export type EditDailyActivityValues = z.infer<typeof editDailyActivitySchema>;
