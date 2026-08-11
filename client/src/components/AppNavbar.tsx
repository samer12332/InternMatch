import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export const AppNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar app-navbar border-bottom">
            <div className="container app-navbar-content">
                <Link
                    className="navbar-brand d-flex align-items-center gap-2 fw-semibold mb-0"
                    to={
                        user?.role === "STUDENT"
                            ? "/student"
                            : user?.role === "COMPANY"
                              ? "/company"
                              : "/admin"
                    }
                >
                    <span className="brand-mark">IM</span>
                    <span className="brand-label">InternMatch</span>
                </Link>
                {user && (
                    <div className="app-navbar-actions">
                        {user.role === "STUDENT" && (
                            <div className="student-nav-links">
                                <NavLink
                                    end
                                    className={({ isActive }) =>
                                        `student-nav-link${isActive ? " active" : ""}`
                                    }
                                    to="/student"
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    className={({ isActive }) =>
                                        `student-nav-link${isActive ? " active" : ""}`
                                    }
                                    to="/student/internships"
                                >
                                    Eligible Internships
                                </NavLink>
                                <NavLink
                                    className={({ isActive }) =>
                                        `student-nav-link${isActive ? " active" : ""}`
                                    }
                                    to="/student/wishes"
                                >
                                    My Wishes
                                </NavLink>
                            </div>
                        )}
                        {user.role === "COMPANY" && (
                            <div className="student-nav-links">
                                <NavLink
                                    end
                                    className={({ isActive }) =>
                                        `student-nav-link${isActive ? " active" : ""}`
                                    }
                                    to="/company"
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    className={({ isActive }) =>
                                        `student-nav-link${isActive ? " active" : ""}`
                                    }
                                    to="/company/internships"
                                >
                                    My Internships
                                </NavLink>
                                <NavLink
                                    className={({ isActive }) =>
                                        `student-nav-link${isActive ? " active" : ""}`
                                    }
                                    to="/company/students"
                                >
                                    Search Students
                                </NavLink>
                            </div>
                        )}
                        <div className="account-actions">
                            <span className="text-muted small d-none d-lg-inline">
                                {user.email}
                            </span>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={handleLogout}
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
