import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import userLineIcon from '@/assets/svgs/user-line.svg';
import { LOCATION_OPTIONS } from '@/data/locationOptions';
import { useAcceptAdminInviteForm } from '@/features/auth/hooks/useAcceptAdminInviteForm';
import { ROUTES } from '@/utils/route-constants';
import { cn } from '@/libs/cn';

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
    <section className="rounded-[36px] bg-white p-6">
      <div className="flex flex-col items-center gap-2">
        <div className="grid h-16 w-16 place-items-center rounded-2xl border border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
          <img src={userLineIcon} alt="" className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="text-center text-2xl leading-8 font-medium text-neutral-grey-600">
          Invalid invitation link
        </h1>
        <p className="max-w-[318px] text-center text-base leading-6 text-neutral-grey-500">
          This link is missing a token or has expired. Ask an administrator to
          send a new invite.
        </p>
      </div>
      <Button
        as={Link}
        to={ROUTES.user.auth.login}
        variant="auth"
        size="auth"
        className="mt-6 w-full"
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
    <section className="rounded-[28px] bg-white p-5 sm:rounded-[36px] sm:p-6">
      <div className="flex flex-col items-center gap-1.5">
        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
          <img src={userLineIcon} alt="" className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="text-center text-xl leading-7 font-medium text-neutral-grey-600 sm:text-2xl sm:leading-8">
          Accept admin invitation
        </h1>
        <p className="max-w-[318px] text-center text-sm leading-5 text-neutral-grey-500 sm:text-base sm:leading-6">
          {mode === 'existing'
            ? 'If you already have a Surge account (for example as an agent), accept with one click. Your account will be upgraded to administrator.'
            : 'Create your administrator profile to finish setting up access.'}
        </p>
      </div>

      <div className="my-4 h-px bg-neutral-grey-100 sm:my-5" />

      <ModeToggle mode={mode} onChange={setMode} />

      {mode === 'existing' ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-neutral-grey-500">
            Use the email address that received this invitation. Existing sessions
            will be signed out when you accept.
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
            Use at least 12 characters with uppercase, lowercase, a number, and a
            special character.
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
        <Link to={ROUTES.user.auth.login} className="text-brand-primary underline">
          Back to login
        </Link>
      </p>
    </section>
  );
}
