export const ROUTES = {
  user: {
    auth: {
      login: '/auth/login',
      forgotPassword: '/auth/forgot-password/email',
      forgotPasswordWithPhone: '/auth/forgot-password/phone',
      otpVerification: '/auth/otp-verification',
      register: '/auth/register',
      resetPassword: '/auth/reset-password',
      createAccountWithEmail: '/auth/create-account/email',
      createAccountWithPhone: '/auth/create-account/phone',
      setPassword: '/auth/set-password',
    },
    dashboard: {
      root: '/dashboard',
      overview: '/dashboard/overview',
      dailyApplicationUpdates: '/dashboard/daily-application-updates',
      newDailyApplicationUpdate: '/dashboard/daily-application-updates/new',
      commissions: '/dashboard/commissions',
    },
  },
};
