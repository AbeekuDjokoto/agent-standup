import { Link } from 'react-router-dom';

import userLineIcon from '@/assets/svgs/user-line.svg';
import { Button } from '@/components/Button';
import { FormAlert } from '@/components/FormAlert';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { LOCATION_OPTIONS } from '@/data/locationOptions';
import {
  authCardClassName,
  authCardHeaderClassName,
  authCardSubtitleClassName,
  authCardTitleClassName,
} from '@/features/auth/authCardStyles';
import { useRegisterForm } from '@/features/auth/hooks';
import { ROUTES } from '@/utils/route-constants';

export const Register = () => {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
  } = useRegisterForm();

  return (
    <section className={authCardClassName}>
      <div className={authCardHeaderClassName}>
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
          <img src={userLineIcon} alt="" className="h-8 w-8" aria-hidden />
        </div>
        <h1 className={authCardTitleClassName}>Create your account</h1>
        <p className={authCardSubtitleClassName}>
          Register to start managing your daily applications and commissions.
        </p>
      </div>

      <div className="my-4 h-px bg-neutral-grey-100 sm:my-5" />

      <form className="space-y-2.5" onSubmit={handleSubmit(onSubmit)}>
        {errors.root?.message ? (
          <FormAlert>{errors.root.message}</FormAlert>
        ) : null}
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
