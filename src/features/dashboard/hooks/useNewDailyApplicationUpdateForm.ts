import { zodResolver } from '@hookform/resolvers/zod';
import { serverTimestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useAuth } from '@/context/authContext';
import { useToast } from '@/hooks';
import { postAgentRecord } from '@/services/agentService';
import { ROUTES } from '@/utils/route-constants';
import {
  newDailyApplicationUpdateSchema,
  type NewDailyApplicationUpdateValues,
} from '@/features/dashboard/pages/NewDailyApplicationUpdate/newDailyApplicationUpdateSchema';

export function useNewDailyApplicationUpdateForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useAuth();

  type NewDailyUpdateFormInput = z.input<typeof newDailyApplicationUpdateSchema>;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<
    NewDailyUpdateFormInput,
    unknown,
    NewDailyApplicationUpdateValues
  >({
    resolver: zodResolver(newDailyApplicationUpdateSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: currentUser?.displayName ?? '',
      location: '',
      applicationsCount: 0,
      totalAmount: 0,
      updateDate: new Date(),
    },
  });

  const onSubmit = async (values: NewDailyApplicationUpdateValues) => {
    if (!currentUser?.uid) {
      toast.error('You must be logged in to submit an update.');
      return;
    }

    try {
      await postAgentRecord({
        ...values,
        agentUid: currentUser.uid,
        agentEmail: currentUser.email ?? '',
        status: 'Submitted',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success('Daily update submitted successfully.');
      navigate(ROUTES.user.dashboard.dailyApplicationUpdates);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to submit daily update. Please try again.';
      toast.error(message);
    }
  };

  const onFormSubmit = handleSubmit(onSubmit);

  return {
    register,
    control,
    formState: { errors, isSubmitting, isValid },
    onFormSubmit,
  };
}
