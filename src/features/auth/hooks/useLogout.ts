import { useNavigate } from 'react-router-dom';

import { logoutUser } from '@/utils/logout';
import { ROUTES } from '@/utils/route-constants';

export function useLogout() {
  const navigate = useNavigate();

  async function logout() {
    await logoutUser();
    navigate(ROUTES.user.auth.login, { replace: true });
  }

  return { logout };
}
