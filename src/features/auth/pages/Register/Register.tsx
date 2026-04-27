import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ROUTES } from '@/utils/route-constants';
import { useRegisterForm } from '@/features/auth/hooks';

export const Register = () => {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
    onGoogleSignIn,
  } = useRegisterForm();

  return (
    <section className="rounded-[36px] bg-white p-6">
      <div className="flex flex-col items-center gap-2">
        <div className="grid h-16 w-16 place-items-center rounded-2xl border border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
          <span className="text-xl text-brand-primary">📝</span>
        </div>
        <h1 className="text-center text-2xl leading-8 font-medium text-neutral-grey-600">
          Create your account
        </h1>
        <p className="max-w-[318px] text-center text-base leading-6 text-neutral-grey-500">
          Register to start managing your daily applications and commissions.
        </p>
      </div>

      <div className="my-6 h-px bg-neutral-grey-100" />

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
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

        <Input
          type="password"
          label="Password"
          placeholder="••••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          type="password"
          label="Confirm Password"
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
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>

        <Button
          type="button"
          variant="google"
          size="auth"
          className="w-full"
          icon="logos:google-icon"
          iconPosition="left"
          onClick={onGoogleSignIn}
          disabled={isSubmitting}
        >
          Continue with Google
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-grey-500">
        Already have an account?{' '}
        <Link to={ROUTES.user.auth.login} className="text-brand-primary underline">
          Login
        </Link>
      </p>
    </section>
  );
};
