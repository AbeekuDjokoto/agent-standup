import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { z } from 'zod';

import {
  newDailyApplicationUpdateSchema,
  type NewDailyApplicationUpdateValues,
} from '@/features/dashboard/pages/NewDailyApplicationUpdate/newDailyApplicationUpdateSchema';
import { useAgentIdentity } from '@/hooks';
import { createDailyActivity } from '@/services/activityService';
import { useAuthStore } from '@/stores';
import { getAuthDisplayName } from '@/utils/auth';
import { isWeekendInTimeZone } from '@/utils/businessDays';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { ROUTES } from '@/utils/route-constants';

export function useNewDailyApplicationUpdateForm() {
  const navigate = useNavigate();
  const { agentUid, displayName, locationStation } = useAgentIdentity();
  const storeUser = useAuthStore((state) => state.user);

  type NewDailyUpdateFormInput = z.input<
    typeof newDailyApplicationUpdateSchema
  >;

  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
  } = useForm<
    NewDailyUpdateFormInput,
    unknown,
    NewDailyApplicationUpdateValues
  >({
    resolver: zodResolver(newDailyApplicationUpdateSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: displayName,
      location: locationStation,
      applicationsCount: '',
      totalAmount: '',
      updateDate: new Date(),
    },
  });

  useEffect(() => {
    const fullName =
      storeUser?.full_name?.trim() ||
      getAuthDisplayName(storeUser) ||
      displayName;
    const location = storeUser?.location_station ?? locationStation;

    reset((current) => ({
      ...current,
      fullName,
      location,
    }));

    void trigger(['fullName', 'location']);
  }, [storeUser, displayName, locationStation, reset, trigger]);

  const isWeekendBlocked = isWeekendInTimeZone();

  const onSubmit = async (values: NewDailyApplicationUpdateValues) => {
    clearErrors('root');

    const userId = storeUser?.id ?? agentUid;

    if (!userId) {
      setError('root', {
        type: 'server',
        message: 'You must be logged in to submit an update.',
      });
      return;
    }

    if (isWeekendInTimeZone()) {
      setError('root', {
        type: 'server',
        message:
          'Daily updates cannot be submitted on Saturday or Sunday (Ghana time).',
      });
      return;
    }

    const agentFullName =
      storeUser?.full_name?.trim() ||
      getAuthDisplayName(storeUser) ||
      values.fullName;
    const location = storeUser?.location_station ?? values.location;

    try {
      await createDailyActivity({
        agent_uuid: userId,
        agent_full_name: agentFullName,
        location,
        applications_count: values.applicationsCount,
        loan_amount: values.totalAmount,
        update_date: dayjs(values.updateDate).format('YYYY-MM-DD'),
      });

      navigate(ROUTES.user.dashboard.dailyApplicationUpdates);
    } catch (error) {
      setError('root', {
        type: 'server',
        message: getApiErrorMessage(
          error,
          'Unable to submit daily update. Please try again.',
        ),
      });
    }
  };

  const onFormSubmit = handleSubmit(onSubmit);

  return {
    register,
    control,
    formState: { errors, isSubmitting, isValid },
    onFormSubmit,
    isWeekendBlocked,
  };
}
