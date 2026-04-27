import dayjs from 'dayjs';
import isEmail from 'validator/es/lib/isEmail';
import isMobilePhone from 'validator/es/lib/isMobilePhone';
import isNumeric from 'validator/es/lib/isNumeric';
import z from 'zod';

export function getNumericStringSchema(label: string = 'Field') {
  return z.union([
    z
      .string()
      .refine((val) => isNumeric(val), `${label} must be a valid number`)
      .transform((val) => Number(val)),
    z.number({ error: `${label} is required` }),
  ]);
}
export function getRequiredStringSchema(label: string = 'Field') {
  const msg = `${label} is required`;
  return z.string({ error: msg }).trim().min(1, `${label} is required`);
}

export function getRequiredDateSchema(label: string = 'Date') {
  const msg = `${label} is required`;
  return z.date({ error: msg });
}

export function getOptionalStringSchema() {
  return z.string().trim().optional().nullable();
}

export function getRequiredPhoneNumberSchema() {
  return z.string().refine((val) => {
    let newValue = '';
    if (val.startsWith('0')) {
      newValue = val.replace('0', '+234');
    }
    if (val.startsWith('+234')) {
      newValue = val;
    }
    return isMobilePhone(newValue);
  }, 'Phone number is invalid');
}
export function getOptionalPhoneNumberSchema() {
  return getRequiredPhoneNumberSchema().optional().nullable();
}
export function getRequiredEmailSchema(label: string = 'Email') {
  return getRequiredStringSchema(label)
    .trim()
    .refine((val) => isEmail(val), 'Invalid email');
}
export function getOptionalEmailSchema() {
  return z
    .string()
    .refine((val) => (val ? isEmail(val) : true), 'Invalid email')
    .optional()
    .nullable();
}

export function getOptionalFileSchema(label: string = 'Field') {
  return z
    .union([z.instanceof(File), z.string()], {
      error: `${label} is required`,
    })
    .nullable()
    .optional();
}

export function getPasswordVerificationSchema(label: string = 'Field') {
  return z
    .string()
    .min(8, { message: `${label} must be at least 8 characters long.` })
    .refine((val) => /\d/.test(val), {
      message: `${label} must include at least one number.`,
    })
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: `${label} must include at least one letter.`,
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: `${label} must include at least a capital letter.`,
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message: `${label} must contain at least one symbol.`,
    });
}

export function getValidNigerianPhoneNumber() {
  return z
    .string()
    .regex(/^(\+?234|0)?[789]\d{9}$/, { message: 'Invalid phone number' });
}

export function getAccountNumberStringSchema(label: string = 'Field') {
  return z.union([
    z
      .string()
      .max(10, 'Account number cannot exceed 10 digits')
      .refine((val) => isNumeric(val), `${label} must be a valid number`)
      .transform((val) => Number(val)),
    z.number({ error: `${label} is required` }),
  ]);
}

export function getRequiredExpiryDateSchema(label: string = 'Expiry Date') {
  const msg = `${label} is required and must be in MM/YYYY format`;

  return z
    .string({ error: msg })
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, msg) // Validates MM/YYYY format
    .refine(
      (date) => {
        const [month, year] = date.split('/').map(Number);
        const currentYear = dayjs().year(); // Full current year (e.g., 2024)
        const currentMonth = dayjs().month() + 1; // Current month (1-12)

        // Ensure the expiry date is in the future
        return (
          year > currentYear || (year === currentYear && month >= currentMonth)
        );
      },
      { message: `${label} must be a future date` },
    );
}

export function getCvvNumericStringSchema(label: string = 'Field') {
  return z
    .string({ error: `${label} is required` })
    .refine((val) => /^\d+$/.test(val), {
      message: `${label} must contain only digits`,
    });
}

export function formatDateTransaction(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, '0'); // Ensures two-digit day
  const month = date.toLocaleString('en-US', { month: 'long' }); // Full month name
  const year = date.getFullYear(); // Full year
  const hours = date.getHours() % 12 || 12; // Converts 24-hour format to 12-hour
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensures two-digit minutes
  const amPm = date.getHours() >= 12 ? 'PM' : 'AM'; // Determines AM/PM

  return `${day} ${month}, ${year} | ${hours}:${minutes} ${amPm}`;
}

export function formatDateFixed(date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  // Function to add ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'; // Covers 11th-13th
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
}
