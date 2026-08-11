import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "./AuthContext";
import type { UserRole } from "../types/auth";

const dashboardPathForRole = (role: UserRole) =>
    role === "STUDENT"
        ? "/student"
        : role === "COMPANY"
          ? "/company"
          : "/admin";

export const ProtectedRoute = ({
    allowedRole,
    children,
}: {
    allowedRole: UserRole;
    children: ReactNode;
}) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading)
        return <div className="page-loading">Restoring your session…</div>;
    if (!user)
        return <Navigate to="/login" replace state={{ from: location }} />;
    if (user.role !== allowedRole)
        return <Navigate to={dashboardPathForRole(user.role)} replace />;

    return <>{children}</>;
};

export { dashboardPathForRole };
