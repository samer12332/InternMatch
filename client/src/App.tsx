import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./auth/AuthContext";
import { dashboardPathForRole, ProtectedRoute } from "./auth/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminUnavailablePage } from "./pages/AdminUnavailablePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterCompanyPage } from "./pages/RegisterCompanyPage";
import { RegisterStudentPage } from "./pages/RegisterStudentPage";
import { StudentInternshipsPage } from "./pages/StudentInternshipsPage";
import { StudentWishesPage } from "./pages/StudentWishesPage";

const HomeRedirect = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="page-loading">Restoring your session…</div>;
  return <Navigate to={user ? dashboardPathForRole(user.role) : "/login"} replace />;
};

export const App = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register/student" element={<RegisterStudentPage />} />
    <Route path="/register/company" element={<RegisterCompanyPage />} />
    <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><AdminUnavailablePage /></ProtectedRoute>} />
    <Route path="/student" element={<ProtectedRoute allowedRole="STUDENT"><DashboardPage role="STUDENT" /></ProtectedRoute>} />
    <Route path="/student/internships" element={<ProtectedRoute allowedRole="STUDENT"><StudentInternshipsPage /></ProtectedRoute>} />
    <Route path="/student/wishes" element={<ProtectedRoute allowedRole="STUDENT"><StudentWishesPage /></ProtectedRoute>} />
    <Route path="/company" element={<ProtectedRoute allowedRole="COMPANY"><DashboardPage role="COMPANY" /></ProtectedRoute>} />
    <Route path="*" element={<HomeRedirect />} />
  </Routes>
);
