import { Link, useSearchParams } from 'react-router-dom';

import userLineIcon from '@/assets/svgs/user-line.svg';
import { Button } from '@/components/Button';
import { FormAlert } from '@/components/FormAlert';
import { Input } from '@/components/Input';
import {
  authCardClassName,
  authCardHeaderClassName,
  authCardSubtitleClassName,
  authCardTitleClassName,
} from '@/features/auth/authCardStyles';
import { useForgotPasswordForm } from '@/features/auth/hooks/useForgotPasswordForm';
import { ResetPassword } from '@/features/auth/pages/ResetPassword';
import { ROUTES } from '@/utils/route-constants';

function ForgotPasswordRequestForm() {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
    isSubmitted,
    successMessage,
  } = useForgotPasswordForm();

  return (
    <section className={authCardClassName}>
      <div className={authCardHeaderClassName}>
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] sm:h-16 sm:w-16">
          <img
            src={userLineIcon}
            alt=""
            className="h-7 w-7 sm:h-8 sm:w-8"
            aria-hidden
          />
        </div>
        <h1 className={authCardTitleClassName}>Reset your password</h1>
        <p className={authCardSubtitleClassName}>
          {isSubmitted
            ? successMessage
            : 'Enter your email address and we will send reset instructions if an account exists for that email.'}
        </p>
      </div>

      <div className="my-4 h-px bg-neutral-grey-100 sm:my-6" />

      {isSubmitted ? (
        <Button
          as={Link}
          to={ROUTES.user.auth.login}
          variant="auth"
          size="auth"
          className="w-full"
        >
          Back to login
        </Button>
      ) : (
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {errors.root?.message ? (
            <FormAlert>{errors.root.message}</FormAlert>
          ) : null}
          <Input
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="hello@surgeafrica.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            variant="auth"
            size="auth"
            className="mt-1 w-full"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
      )}

      {!isSubmitted ? (
        <p className="mt-6 text-center text-sm text-neutral-grey-500">
          Remember your password?{' '}
          <Link
            to={ROUTES.user.auth.login}
            className="text-brand-primary underline"
          >
            Back to login
          </Link>
        </p>
      ) : null}
    </section>
  );
}

export const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token')?.trim();

  if (resetToken) {
    return <ResetPassword />;
  }

  return <ForgotPasswordRequestForm />;
};
