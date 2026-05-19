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
import { useAcceptAdminInviteForm } from '@/features/auth/hooks/useAcceptAdminInviteForm';
import { cn } from '@/libs/cn';
import { ROUTES } from '@/utils/route-constants';

function ModeToggle({
  mode,
  onChange,
}: {
  mode: 'existing' | 'new';
  onChange: (mode: 'existing' | 'new') => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-grey-100 p-1">
      <button
        type="button"
        onClick={() => onChange('existing')}
        className={cn(
          'rounded-lg px-3 py-2 text-xs font-medium transition sm:text-sm',
          mode === 'existing'
            ? 'bg-white text-neutral-grey-600 shadow-sm'
            : 'text-neutral-grey-500 hover:text-neutral-grey-600',
        )}
      >
        I have an account
      </button>
      <button
        type="button"
        onClick={() => onChange('new')}
        className={cn(
          'rounded-lg px-3 py-2 text-xs font-medium transition sm:text-sm',
          mode === 'new'
            ? 'bg-white text-neutral-grey-600 shadow-sm'
            : 'text-neutral-grey-500 hover:text-neutral-grey-600',
        )}
      >
        New account
      </button>
    </div>
  );
}

function InvalidInviteLink() {
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
        <h1 className={authCardTitleClassName}>Invalid invitation link</h1>
        <p className={authCardSubtitleClassName}>
          This link is missing a token or has expired. Ask an administrator to
          send a new invite.
        </p>
      </div>
      <Button
        as={Link}
        to={ROUTES.user.auth.login}
        variant="auth"
        size="auth"
        className="mt-4 w-full sm:mt-6"
      >
        Back to login
      </Button>
    </section>
  );
}

export function AcceptAdminInvite() {
  const {
    token,
    mode,
    setMode,
    register,
    errors,
    submitError,
    isValid,
    isSubmitting,
    handleSubmit,
    onSubmitNewUser,
    acceptWithTokenOnly,
  } = useAcceptAdminInviteForm();

  if (!token) {
    return <InvalidInviteLink />;
  }

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
        <h1 className={authCardTitleClassName}>Accept admin invitation</h1>
        <p className={authCardSubtitleClassName}>
          {mode === 'existing'
            ? 'If you already have a Surge account (for example as an agent), accept with one click. Your account will be upgraded to administrator.'
            : 'Create your administrator profile to finish setting up access.'}
        </p>
      </div>

      <div className="my-4 h-px bg-neutral-grey-100 sm:my-5" />

      <ModeToggle mode={mode} onChange={setMode} />

      {submitError && mode === 'existing' ? (
        <FormAlert className="mt-4">{submitError}</FormAlert>
      ) : null}

      {mode === 'existing' ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-neutral-grey-500">
            Use the email address that received this invitation. Existing
            sessions will be signed out when you accept.
          </p>
          <Button
            type="button"
            variant="auth"
            size="auth"
            className="w-full"
            disabled={isSubmitting}
            loading={isSubmitting}
            onClick={() => void acceptWithTokenOnly()}
          >
            {isSubmitting ? 'Accepting...' : 'Accept invitation'}
          </Button>
        </div>
      ) : (
        <form
          className="mt-4 space-y-2.5"
          onSubmit={handleSubmit(onSubmitNewUser)}
        >
          {errors.root?.message ? (
            <FormAlert>{errors.root.message}</FormAlert>
          ) : null}
          {submitError ? <FormAlert>{submitError}</FormAlert> : null}
          <Input
            label="Full name"
            placeholder="e.g. Abeeku Djokoto"
            error={errors.fullName?.message}
            {...register('fullName')}
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
            placeholder="••••••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <p className="text-xs leading-4 text-neutral-grey-500">
            Use at least 12 characters with uppercase, lowercase, a number, and
            a special character.
          </p>

          <Button
            type="submit"
            variant="auth"
            size="auth"
            className="mt-4 w-full"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create admin account'}
          </Button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-neutral-grey-500 sm:mt-5">
        <Link
          to={ROUTES.user.auth.login}
          className="text-brand-primary underline"
        >
          Back to login
        </Link>
      </p>
    </section>
  );
}
