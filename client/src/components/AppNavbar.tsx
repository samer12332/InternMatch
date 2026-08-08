import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand app-navbar border-bottom">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-semibold mb-0" to={user?.role === "STUDENT" ? "/student" : user?.role === "COMPANY" ? "/company" : "/admin"}>
          <span className="brand-mark">IM</span><span className="brand-label">InternMatch</span>
        </Link>
        {user && (
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small d-none d-md-inline">{user.email}</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>Log out</button>
          </div>
        )}
      </div>
    </nav>
  );
};
