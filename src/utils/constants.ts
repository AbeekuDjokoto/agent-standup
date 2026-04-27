import { ROUTES } from './route-constants';

export const ENV_VARS = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'https://alertsavings-api.enyata.com',
  FCM_TOKEN: import.meta.env.VITE_FCM_TOKEN || '',
};

export const ENVIRONMENT = import.meta.env.NODE_ENV;
export const isTesting = ENVIRONMENT === 'test';
export const isDev = ENVIRONMENT === 'development';

export const DEFAULT_QUERY = {
  page: 1,
  limit: 10,
  search: '',
  status: '',
  date: '',
  role: '',
  type: '',
  plan: '',
  schedule: '',
  targetType: '',
  endDate: '',
  action: '',
  savingsType: '',
  startDates: '',
};

export const menuItems = [
  {
    icon: 'building-02',
    name: 'Overview',
    path: ROUTES.user.dashboard,
    topbarName: 'Dashboard',
  },
];

export const OPTIONS = {
  ACTIVE: ['active', 'inactive'],
  TXNTYPE: ['savings', 'investment', 'withdrawal', 'wallet funding'],
  SUCCESSFUL: ['Successful', 'Failed', 'Pending'],
  SUCCESS: ['Success', 'Failed'],
  ACTIVITY: ['Created', 'Deleted', 'Updated', 'Viewed'],
  PERIOD: [
    { label: 'Today', value: 'day' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'This Year', value: 'year' },
    { label: 'General', value: 'general' },
  ],
  INVESTMENT_DURATION: [
    { label: '1 month', value: '1' },
    { label: '3 months', value: '3' },
    { label: '6 months', value: '6' },
    { label: '9 months', value: '9' },
    { label: '12 months', value: '12' },
  ],
  INVESTMENT_TYPE: [
    { label: 'Fixed', value: 'fixed' },
    { label: 'Flexible', value: 'flexible' },
  ],
  USER_PERIOD: [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this_week' },
    { label: 'This Month', value: 'this_month' },
    { label: 'This Year', value: 'this_year' },
    { label: 'General', value: 'all_time' },
  ],
  AMOUNT_RANGE: [
    { label: 'Under ₦1,000,000 - ₦4,999,000', value: '1000000-4999000' },
    { label: '₦5,000,000 - ₦9,999,000', value: '5000000-9999000' },
    { label: '₦10,000,000 - ₦14,999,000', value: '10000000-14999000' },
    { label: '₦20,000,000 - ₦49,999,000', value: '20000000-49999000' },
    { label: '₦50,000,000 - ₦99,999,000', value: '50000000-99999000' },
    { label: '₦100,000,000 - ₦149,999,000', value: '100000000-149999000' },
    { label: '₦500M - above', value: '500000000-199999000' },
  ],
  DAYS_OPTONS: [
    { label: '30 days', value: '30' },
    { label: '60 days', value: '60' },
    { label: '90 days', value: '90' },
    { label: '120 days', value: '120' },
    { label: '180 days', value: '180' },
    { label: '365 days', value: '365' },
  ],
  SAVINGS_TYPE: [
    { label: 'Target Savings', value: 'target-savings' },
    { label: 'Group Savings', value: 'group-savings' },
    { label: 'Fixed Savings', value: 'fixed-savings' },
    { label: 'Lock Funds', value: 'lock-funds' },
  ],
  SAVING_FREQUENCY: [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ],
  GROUP_SAVINGS_TYPE: [
    { label: 'Duo', value: 'duo' },
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
  ],
};

export const StatusVariants: Record<
  string,
  'error' | 'warning' | 'success' | 'blue'
> = {
  active: 'success',
  inactive: 'error',
  deactivated: 'error',
  approved: 'success',
  pending: 'warning',
  reviewed: 'warning',
  declined: 'error',
  rejected: 'error',
  paid: 'success',
  running: 'success',
  sent: 'success',
  completed: 'success',
  successful: 'success',
  success: 'success',
  failed: 'error',
  succesfulbutfeenottaken: 'success',
  'tier 1': 'warning',
  'tier 2': 'error',
  'tier 3': 'blue',
  'account on pnd': 'error',
  'account on blacklist': 'error',
  'account on freeze': 'error',
};

export const durationOptions = [
  { label: '30 days', value: '30' },
  { label: '90 days', value: '90' },
  { label: '180 days', value: '180' },
  { label: '270 days', value: '270' },
  { label: '364 days', value: '364' },
];
