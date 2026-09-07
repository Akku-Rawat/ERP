import { useAuth } from "../context/AuthContext";
import { useBootPermissions } from "../hooks/permission/useBootPermission";
import { useBootSubscription } from "../hooks/permission/useBootSubscription";

export const PermissionBootstrap: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  useBootPermissions(user?.roles ?? null, user?.permissions ?? null, authLoading);
  useBootSubscription(user?.subscribedModules ?? null, authLoading);

  return null;
};