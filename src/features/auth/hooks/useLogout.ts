import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/utils/route-constants';
import { logoutUser } from '@/utils/logout';

export function useLogout() {
  const navigate = useNavigate();

  async function logout() {
    await logoutUser();
    navigate(ROUTES.user.auth.login, { replace: true });
  }

  return { logout };
}
