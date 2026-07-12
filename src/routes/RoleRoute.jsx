import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DASHBOARD_ROUTES } from '../utils/constants';

export default function RoleRoute({ allowedRoles = [] }) {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    // Send the user back to the dashboard that actually matches their role
    return <Navigate to={DASHBOARD_ROUTES[role] || '/login'} replace />;
  }

  return <Outlet />;
}
