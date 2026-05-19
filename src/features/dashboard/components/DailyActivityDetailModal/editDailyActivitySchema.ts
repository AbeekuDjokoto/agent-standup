import { z } from 'zod';

export const editDailyActivitySchema = z.object({
  applications_count: z
    .number({ error: 'Applications is required.' })
    .int('Applications must be a whole number.')
    .min(0, 'Applications must be 0 or more.'),
  loan_amount: z
    .number({ error: 'Loan amount is required.' })
    .min(0, 'Loan amount must be 0 or more.'),
  update_date: z.date({ error: 'Reporting date is required.' }),
});

export type EditDailyActivityValues = z.infer<typeof editDailyActivitySchema>;
