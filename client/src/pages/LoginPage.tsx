import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../api/errors";
import { useAuth } from "../auth/AuthContext";
import { dashboardPathForRole } from "../auth/ProtectedRoute";

type LocationState = { message?: string; from?: { pathname?: string } };

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });
      const destination = state?.from?.pathname;
      navigate(destination && destination !== "/login" ? destination : dashboardPathForRole(user.role), { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to sign in."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page container py-5">
      <section className="card shadow-sm auth-card">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex align-items-center gap-2 mb-4"><span className="brand-mark">IM</span><span className="brand-label fw-semibold fs-5">InternMatch</span></div>
          <p className="auth-eyebrow mb-2">Account access</p>
          <h1 className="h2 mb-2">Welcome back</h1>
          <p className="text-muted mb-4">Sign in to continue to your workspace.</p>
          {state?.message && <div className="alert alert-success">{state.message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <input className="form-control" id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="password">Password</label>
              <input className="form-control" id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
            </div>
            <button className="btn btn-primary w-100 py-2" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <hr className="my-4" />
          <p className="mb-0 text-center small">New here? <Link to="/register/student">Register as a student</Link> or <Link to="/register/company">as a company</Link>.</p>
        </div>
      </section>
    </main>
  );
};
