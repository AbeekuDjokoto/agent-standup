import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import userLineIcon from '@/assets/svgs/user-line.svg';
import { LOCATION_OPTIONS } from '@/data/locationOptions';
import { ROUTES } from '@/utils/route-constants';
import { useRegisterForm } from '@/features/auth/hooks';

export const Register = () => {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
  } = useRegisterForm();

  return (
    <section className="rounded-[28px] bg-white p-5 sm:rounded-[36px] sm:p-6">
      <div className="flex flex-col items-center gap-1.5">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
          <img src={userLineIcon} alt="" className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="text-center text-xl leading-7 font-medium text-neutral-grey-600 sm:text-2xl sm:leading-8">
          Create your account
        </h1>
        <p className="max-w-[318px] text-center text-sm leading-5 text-neutral-grey-500 sm:text-base sm:leading-6">
          Register to start managing your daily applications and commissions.
        </p>
      </div>

      <div className="my-4 h-px bg-neutral-grey-100 sm:my-5" />

      <form className="space-y-2.5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full Name"
          placeholder="e.g. Abeeku Djokoto"
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <Input
          label="Email Address"
          placeholder="hello@surgeafrica.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Select
          id="locationStation"
          label="Location station"
          error={errors.locationStation?.message}
          {...register('locationStation')}
        >
          <option value="">Select location station</option>
          {LOCATION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <Input
          type="password"
          label="Password"
          placeholder="••••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <p className="text-xs leading-4 text-neutral-grey-500">
          Use at least 8 characters with uppercase, lowercase, a number, and a
          special character.
        </p>

        <Button
          type="submit"
          variant="auth"
          size="auth"
          className="mt-6 w-full"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-neutral-grey-500 sm:mt-5">
        Already have an account?{' '}
        <Link
          to={ROUTES.user.auth.login}
          className="text-brand-primary underline"
        >
          Login
        </Link>
      </p>
    </section>
  );
};
