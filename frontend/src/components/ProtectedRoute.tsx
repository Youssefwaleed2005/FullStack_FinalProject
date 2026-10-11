import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Alert, Container } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
  allowedRoles?: string[];
};

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">
          You do not have permission to view this page.
        </Alert>
      </Container>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
