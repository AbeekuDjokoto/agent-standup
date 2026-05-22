export const ROUTES = {
  user: {
    auth: {
      login: '/auth/login',
      forgotPassword: '/auth/forgot-password',
      forgotPasswordWithPhone: '/auth/forgot-password/phone',
      otpVerification: '/auth/otp-verification',
      register: '/auth/register',
      resetPassword: '/auth/reset-password',
      createAccountWithEmail: '/auth/create-account/email',
      createAccountWithPhone: '/auth/create-account/phone',
      setPassword: '/auth/set-password',
      /** Canonical path used in admin invite emails (ADMIN_INVITE_URL_BASE). */
      acceptInvite: '/auth/accept-invite',
      /** Legacy alias — redirects to acceptInvite preserving query params. */
      acceptAdminInvite: '/auth/accept-admin-invite',
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
