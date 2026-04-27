import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ROUTES } from '@/utils/route-constants';
import { useForgotPasswordForm } from '@/features/auth/hooks/useForgotPasswordForm';

export const ForgotPassword = () => {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    onSubmit,
    onGoogleSignIn,
  } = useForgotPasswordForm();

  return (
    <section className="rounded-[36px] bg-white p-6">
      <div className="flex flex-col items-center gap-2">
        <div className="grid h-16 w-16 place-items-center rounded-2xl border border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
          <span className="text-xl text-brand-primary">🔐</span>
        </div>
        <h1 className="text-center text-2xl leading-8 font-medium text-neutral-grey-600">
          Reset your password
        </h1>
        <p className="max-w-[318px] text-center text-base leading-6 text-neutral-grey-500">
          Enter your email address and we will send a reset link.
        </p>
      </div>

      <div className="my-6 h-px bg-neutral-grey-100" />

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email Address"
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
        >
          {isSubmitting ? 'Sending...' : 'Send reset link'}
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
        Remember your password?{' '}
        <Link to={ROUTES.user.auth.login} className="text-brand-primary underline">
          Back to login
        </Link>
      </p>
    </section>
  );
};
