import { useEffect } from 'react';

import { loadIcons } from '@iconify/react';

const iconMap = {
  'hugeicons:dashboard-square-03': null,
  'hugeicons:money-exchange-01': null,
  'hugeicons:piggy-bank': null,
  'hugeicons:chart-evaluation': null,
  'hugeicons:user-multiple': null,
  'hugeicons:user-circle': null,
  'hugeicons:audit-02': null,
  'hugeicons:notification-square': null,
  'hugeicons:settings-01': null,
  'hugeicons:notification-01': null,
  'hugeicons:edit-02': null,
  'hugeicons:cancel-circle': null,
  'hugeicons:checkmark-circle-02': null,
  'hugeicons:delete-03': null,
  'hugeicons:more-vertical-circle-01': null,
  'hugeicons:id-verified': null,
  'hugeicons:home-01': null,
  'hugeicons:arrow-left-02': null,
  'hugeicons:arrow-right-double': null,
  'hugeicons:search-01': null,
  'hugeicons:square-lock-password': null,
  'hugeicons:camera-01': null,
  'hugeicons:edit-01': null,
  'hugeicons:mail-01': null,
  'hugeicons:logout-03': null,
  'hugeicons:loading-03': null,
  'hugeicons:plus-sign': null,
  'hugeicons:calendar-04': null,
  'hugeicons:credit-card': null,
  'hugeicons:cancel-01': null,
  'material-symbols:arrow-drop-down-rounded': null,
};
const iconNames = Object.keys(iconMap);

export const IconPreloader = () => {
  useEffect(() => {
    loadIcons(iconNames);
  }, []);

  return null;
};
