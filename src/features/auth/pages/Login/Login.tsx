import { Link } from 'react-router-dom';

import userLineIcon from '@/assets/svgs/user-line.svg';
import { Checkbox } from '@/components';
import { Button } from '@/components/Button';
import { FormAlert } from '@/components/FormAlert';
import { Input } from '@/components/Input';
import {
  authCardClassName,
  authCardHeaderClassName,
  authCardSubtitleClassName,
  authCardTitleClassName,
} from '@/features/auth/authCardStyles';
import { useLoginForm } from '@/features/auth/hooks';
import { ROUTES } from '@/utils/route-constants';

export const Login = () => {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
  } = useLoginForm();

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
        <h1 className={authCardTitleClassName}>Login to your account</h1>
        <p className={authCardSubtitleClassName}>
          Access your application and continue where you left off.
        </p>
      </div>

      <div className="my-4 h-px bg-neutral-grey-100 sm:my-6" />

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

        <Input
          type="password"
          label="Password"
          placeholder="••••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-neutral-grey-600">
            <Checkbox label="Remember me" {...register('rememberMe')} />
          </label>

          <Link
            className="shrink-0 text-neutral-grey-500 underline"
            to="/auth/forgot-password"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="auth"
          size="auth"
          className="mt-1 w-full"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-neutral-grey-500 sm:mt-6">
        Don&apos;t have an account?{' '}
        <Link
          to={ROUTES.user.auth.register}
          className="text-brand-primary underline"
        >
          Register
        </Link>
      </p>
    </section>
  );
};
