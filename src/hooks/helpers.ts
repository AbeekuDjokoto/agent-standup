import dayjs from 'dayjs';

import { ENV_VARS } from '@/utils/constants';

export function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

export function getQueryString(obj?: Record<string, any>) {
  if (!obj || typeof obj !== 'object') return '';

  return Object.entries(obj)
    .filter(([, value]) => value != null && value !== '') // Exclude null, undefined, and empty string
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');
}

export function removeNullishValues(obj: Record<string, any>) {
  if (!obj || typeof obj !== 'object') return '';

  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) =>
        value !== null && value !== undefined && !Number.isNaN(value),
    ),
  );
}

export function getTarget(
  inputObj: Record<string, any>,
  path: string | string[],
): any {
  const pathArr = Array.isArray(path) ? path : path?.split('.');
  return pathArr.reduce(
    (target, currentPath) => target?.[currentPath],
    inputObj,
  );
}

//=============================
// SentenceCase Function
// Copes with abbreviations
// Mohsen Alyafei (12-05-2017)
//=============================

export function sentenceCase(str: string) {
  return str?.replace(/\.\s+([a-z])[^\\.]|^(\s*[a-z])[^\\.]/g, (s) =>
    s.replace(/([a-z])/, (s) => s.toUpperCase()),
  );
}

export function capitalize(sentence?: string | null) {
  if (!sentence) {
    return '';
  }
  return sentence
    ?.split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function camelToSpaced(str: string) {
  return str?.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
}

export function formatCurrency(
  value?: number | string,
  currency: string = 'NGN',
  fractionalDigit: number = 2,
  locale: string = 'en-NG',
) {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: fractionalDigit,
  });

  const formattedValue = formatter.format(numericValue ?? 0);

  // const decimalPart = formattedValue.includes('.')
  //   ? formattedValue.split('.')[1]
  //   : '';
  // const isDecimalZeroes = decimalPart.includes('00');

  // if (isDecimalZeroes) {
  //   return formattedValue.split('.')[0];
  // }

  return formattedValue;
}

export function formatNumberWithCommas(value?: number | string) {
  if (value === undefined) {
    return '';
  }
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  return numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDate(
  value?: string | Date | null,
  format = 'DD/MM/YYYY',
) {
  const converted = dayjs(value);
  if (!value || !converted.isValid()) return '';
  return converted.format(format);
}

export function verifyAuthentication() {
  if (!window.location.pathname.includes('auth')) {
    if (window.location.pathname.includes('/admin')) {
      window.location.pathname = '/admin/auth/login';
    } else {
      window.location.pathname = '/auth/login';
    }
  }
}

export function redactEmail(email?: string) {
  if (!email?.includes('@')) return email;
  const [local, domain] = email.split('@');
  const [domainName, domainExtension] = domain.split('.');
  const domainNameLength = domainName.length;
  if (domainNameLength > 5) {
    return `${local.slice(0, 2)}**@${domainName.slice(0, 2)}**${domainName[domainNameLength - 1]}.${domainExtension}`;
  }
  return `${local.slice(0, 2)}**@${domainName}.${domainExtension}`;
}

export function withBaseURL(path: `/${string}`) {
  return `${ENV_VARS.API_BASE_URL}/api/v1${path}`;
}

export const resolveAsync = async () =>
  new Promise((resolve) => setTimeout(resolve, 1000));

export async function dataUrlToFile(
  dataUrl: string,
  fileName: string,
): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: 'image/jpeg' });
}

export function getAdminUserFullName(user: {
  firstName: string;
  lastName: string;
}) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Admin';
}

export function getValueAsURL(value: string | File | null) {
  if (!value) return null;
  return typeof value === 'string' ? value : URL.createObjectURL(value!);
}

export function makeDropdownOptions(items: string[]) {
  return items.map((item) => ({
    label: sentenceCase(item),
    value: item,
  }));
}

export function maskNumber(number: string, position: number) {
  const str = number;
  if (position < 0 || position > str.length) {
    throw new Error('Invalid position value');
  }
  return str.slice(0, position) + '*'.repeat(str.length - position);
}

export function formatCompactNumber(number?: number) {
  if (number === undefined) {
    return;
  }
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(number);
}

export const calculateProgress = (startDate: string, maturityDate: string) => {
  const start = dayjs(startDate);
  const end = dayjs(maturityDate);
  const current = dayjs();

  if (!start.isValid() || !end.isValid()) return 0;
  if (current.isBefore(start)) return 0;
  if (current.isAfter(end)) return 1;

  const totalDuration = end.diff(start);
  if (totalDuration === 0) return 1;

  const elapsed = current.diff(start);
  return elapsed / totalDuration;
};

export const calculateProgressPercentage = (
  percentCompleted: string,
  targetAmount: string,
) => {
  return (Number(percentCompleted) / Number(targetAmount)) * 100;
};

export function getComplianceTypes(
  arrString: string[],
  arrObj: { id: number; type: string }[],
) {
  if (!arrObj) return [];

  const existingTypes = arrObj.map((item) => item.type);
  return arrString.filter((item) => !existingTypes.includes(item));
}

export function actionTypeColor(action: string) {
  const actionType = action?.toLowerCase();
  if (!actionType) return '';
  switch (actionType) {
    case 'created':
      return 'text-semantics-green';
    case 'deleted':
      return 'text-semantics-red';
    case 'updated':
      return 'text-semantics-orange';
    case 'viewed':
      return 'text-brand-secondary-blue-300';
    default:
      return '';
  }
}
