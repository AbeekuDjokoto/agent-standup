import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { FormAlert } from '@/components/FormAlert';
import { Input } from '@/components/Input';
import userLineIcon from '@/assets/svgs/user-line.svg';
import {
  authCardClassName,
  authCardHeaderClassName,
  authCardSubtitleClassName,
  authCardTitleClassName,
} from '@/features/auth/authCardStyles';
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
    <section className={authCardClassName}>
      <div className={authCardHeaderClassName}>
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] sm:h-16 sm:w-16">
          <img src={userLineIcon} alt="" className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
        </div>
        <h1 className={authCardTitleClassName}>Set a new password</h1>
        <p className={authCardSubtitleClassName}>
          {hasToken
            ? 'Choose a strong password for your account.'
            : 'This reset link is invalid or has expired. Request a new one to continue.'}
        </p>
      </div>

      <div className="my-4 h-px bg-neutral-grey-100 sm:my-6" />

      {!hasToken && errors.root?.message ? (
        <FormAlert className="mb-4">{errors.root.message}</FormAlert>
      ) : null}

      {hasToken ? (
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {errors.root?.message ? (
            <FormAlert>{errors.root.message}</FormAlert>
          ) : null}
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

      <p className="mt-4 text-center text-sm text-neutral-grey-500 sm:mt-6">
        <Link to={ROUTES.user.auth.login} className="text-brand-primary underline">
          Back to login
        </Link>
      </p>
    </section>
  );
};
