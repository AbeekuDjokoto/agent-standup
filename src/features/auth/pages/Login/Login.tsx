import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Checkbox } from '@/components';
import { useLoginForm } from '@/features/auth/hooks';
import { ROUTES } from '@/utils/route-constants';


export const Login = () => {
    const {
        register,
        formState: { errors, isValid, isSubmitting },
        handleSubmit,
        onSubmit,
        onGoogleSignIn,
    } = useLoginForm();

    return (
        <section className="rounded-[36px] bg-white p-6">
            <div className="flex flex-col items-center gap-2">
                <div className="grid h-16 w-16 place-items-center rounded-2xl border border-neutral-grey-100 shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)]">
                    <span className="text-xl text-brand-primary">👤</span>
                </div>
                <h1 className="text-center text-2xl leading-8 font-medium text-neutral-grey-600">
                    Login to your account
                </h1>
                <p className="max-w-[318px] text-center text-base leading-6 text-neutral-grey-500">
                    Access your application and continue where you left off.
                </p>
            </div>

            <div className="my-6 h-px bg-neutral-grey-100" />

            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Email Address or Phone Number"
                    placeholder="hello@surgeafrica.com or 0559617908"
                    error={errors.identifier?.message}
                    {...register('identifier')}
                />

                <Input
                    type="password"
                    label="Password"
                    placeholder="••••••••••"
                    error={errors.password?.message}
                    {...register('password')}
                />

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-neutral-grey-600">
                        <Checkbox label="Remember me" {...register('rememberMe')} />
                    </label>

                    <Link className="text-neutral-grey-500 underline" to="/auth/forgot-password">
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
                    Sign in with Google
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-grey-500">
                Don&apos;t have an account?{' '}
                <Link to={ROUTES.user.auth.register} className="text-brand-primary underline">
                    Register
                </Link>
            </p>
        </section>
    );
};
