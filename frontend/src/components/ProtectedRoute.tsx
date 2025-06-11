import { Navigate, Outlet } from "react-router-dom";
import { UserRole, User } from "../types/auth";
import { authService } from "../services/auth.service";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
    children: React.ReactNode;
}

export default function ProtectedRoute({
    allowedRoles,
    children,
}: ProtectedRouteProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Chargement...</div>; // Ou un spinner de chargement
    }

    if (!user || !authService.isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}
