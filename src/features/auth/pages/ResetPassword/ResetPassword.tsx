import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import userLineIcon from '@/assets/svgs/user-line.svg';
import { useResetPasswordForm } from '@/features/auth/hooks/useResetPasswordForm';
import { ROUTES } from '@/utils/route-constants';

export const ResetPassword = () => {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
    hasToken,
  } = useResetPasswordForm();

  return (
    <section className="rounded-[36px] bg-white p-6">
      <div className="flex flex-col items-center gap-2">
        <div className="grid h-16 w-16 place-items-center rounded-2xl border border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
          <img src={userLineIcon} alt="" className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="text-center text-2xl leading-8 font-medium text-neutral-grey-600">
          Set a new password
        </h1>
        <p className="max-w-[318px] text-center text-base leading-6 text-neutral-grey-500">
          {hasToken
            ? 'Choose a strong password for your account.'
            : 'This reset link is invalid or has expired. Request a new one to continue.'}
        </p>
      </div>

      <div className="my-6 h-px bg-neutral-grey-100" />

      {hasToken ? (
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="password"
            label="New password"
            autoComplete="new-password"
            placeholder="••••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <p className="text-xs leading-4 text-neutral-grey-500">
            Use at least 8 characters with uppercase, lowercase, a number, and a
            special character.
          </p>

          <Input
            type="password"
            label="Confirm password"
            autoComplete="new-password"
            placeholder="••••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="auth"
            size="auth"
            className="mt-1 w-full"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      ) : (
        <Button
          as={Link}
          to={ROUTES.user.auth.forgotPassword}
          variant="auth"
          size="auth"
          className="w-full"
        >
          Request new reset link
        </Button>
      )}

      <p className="mt-6 text-center text-sm text-neutral-grey-500">
        <Link to={ROUTES.user.auth.login} className="text-brand-primary underline">
          Back to login
        </Link>
      </p>
    </section>
  );
};
