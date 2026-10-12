import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import StateMessage from "@/components/StateMessage";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  // Leave empty to allow any signed-in user
  allowedRoles?: string[];
};

// Wraps routes that need a signed-in user (and optionally a specific role)
function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // Remember where they were going, so login can send them back there
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <StateMessage
          icon={ShieldAlert}
          title="Not available for your account"
          description="You do not have permission to view this page."
          action={
            <Button asChild size="lg" className="rounded-full px-5">
              <Link to="/">Back to home</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
