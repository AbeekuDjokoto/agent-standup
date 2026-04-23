import { z } from "zod";

const numberField = (fieldName, schema) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === undefined || value === null) {
        return undefined;
      }
      const parsedValue = Number(value);
      return Number.isNaN(parsedValue) ? undefined : parsedValue;
    },
    z
      .number({
        required_error: `${fieldName} is required.`,
        invalid_type_error: `${fieldName} must be a number.`,
      })
      .pipe(schema),
  );

export const formSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required."),
  applicationsCount: numberField(
    "Applications count",
    z
      .number()
      .int("Applications count must be a whole number.")
      .min(0, "Applications count must be 0 or greater."),
  ),
  totalAmount: numberField(
    "Total amount",
    z.number().min(0, "Total amount must be 0 or greater."),
  ),
  location: z.string().min(1, "Select a location."),
});
