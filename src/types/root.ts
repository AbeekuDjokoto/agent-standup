import { MutationOptions } from '@tanstack/react-query';

import { DEFAULT_QUERY } from '../utils';

export type TableCellProps<T extends Record<string, any> = { id: string }> =
  Readonly<{
    getValue: () => any;
    row: {
      original: {
        id: string;
        [key: string]: string;
      } & T;
    };
  }>;

export type ToastNotificationType = 'warning' | 'success' | 'error';

export type Func = (...args: any[]) => any;

export type DropdownOption = {
  label: string;
  value: string;
};

export type NativeEventHandler = (
  e: Event & { target: HTMLInputElement },
) => void;

export type MutationExtraConfig = Omit<
  MutationOptions<any, any, any, any>,
  'mutationFn'
>;

export type ResponseRoot<T> = {
  data: T;
  message: string;
  status: string;
  type: string;
  url: string;
  environment: string;
};

export type ListResponse<TData extends Record<string, any>> = {
  [K in keyof TData]: TData[K];
} & {
  page: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
};

export type QueryType = typeof DEFAULT_QUERY;

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  dob: string;
  homeAddress: string;
  state: string;
  LGA: string;
  bvnNumber: number;
  referralCode: number;
  hasVerifiedBVN: boolean;
  iat: number;
  exp: number;
  status: string;
};

export type AdminUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  status: string;
  isSuperAdmin: boolean;
  role: Role | null;
  phoneNumber: string | null;
  profileImage: string | null;
};

export type Role = {
  id: string;
  name: string;
  permissions: string[];
};

export const isAdminUser = (user: User | AdminUser): user is AdminUser => {
  return 'isSuperAdmin' in user;
};
