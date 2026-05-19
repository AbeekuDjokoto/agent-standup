import { Link, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import userLineIcon from '@/assets/svgs/user-line.svg';
import { ROUTES } from '@/utils/route-constants';
import { useForgotPasswordForm } from '@/features/auth/hooks/useForgotPasswordForm';
import { ResetPassword } from '@/features/auth/pages/ResetPassword';

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
    <section className="rounded-[36px] bg-white p-6">
      <div className="flex flex-col items-center gap-2">
        <div className="grid h-16 w-16 place-items-center rounded-2xl border border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
          <img src={userLineIcon} alt="" className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="text-center text-2xl leading-8 font-medium text-neutral-grey-600">
          Reset your password
        </h1>
        <p className="max-w-[318px] text-center text-base leading-6 text-neutral-grey-500">
          {isSubmitted
            ? successMessage
            : 'Enter your email address and we will send reset instructions if an account exists for that email.'}
        </p>
      </div>

      <div className="my-6 h-px bg-neutral-grey-100" />

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
          <Link to={ROUTES.user.auth.login} className="text-brand-primary underline">
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
