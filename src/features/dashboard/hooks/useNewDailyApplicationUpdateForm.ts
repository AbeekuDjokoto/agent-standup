import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useAgentIdentity, useToast } from '@/hooks';
import { createDailyActivity } from '@/services/activityService';
import { useAuthStore } from '@/stores';
import { getAuthDisplayName } from '@/utils/auth';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { ROUTES } from '@/utils/route-constants';
import { isWeekendInTimeZone } from '@/utils/businessDays';
import {
  newDailyApplicationUpdateSchema,
  type NewDailyApplicationUpdateValues,
} from '@/features/dashboard/pages/NewDailyApplicationUpdate/newDailyApplicationUpdateSchema';

export function useNewDailyApplicationUpdateForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { agentUid, displayName, locationStation } = useAgentIdentity();
  const storeUser = useAuthStore((state) => state.user);

  type NewDailyUpdateFormInput = z.input<typeof newDailyApplicationUpdateSchema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
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
      storeUser?.full_name?.trim() || getAuthDisplayName(storeUser) || displayName;
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
    const userId = storeUser?.id ?? agentUid;

    if (!userId) {
      toast.error('You must be logged in to submit an update.');
      return;
    }

    if (isWeekendInTimeZone()) {
      toast.error(
        'Daily updates cannot be submitted on Saturday or Sunday (Ghana time).',
      );
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

      toast.success('Daily update submitted successfully.');
      navigate(ROUTES.user.dashboard.dailyApplicationUpdates);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, 'Unable to submit daily update. Please try again.'),
      );
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
