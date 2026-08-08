import { AppNavbar } from "../components/AppNavbar";
import { useAuth } from "../auth/AuthContext";

export const DashboardPage = ({ role }: { role: "STUDENT" | "COMPANY" }) => {
  const { user } = useAuth();
  const label = role === "STUDENT" ? "Student" : "Company";

  return (
    <>
      <AppNavbar />
      <main className="container py-5">
        <section className="dashboard-hero mb-4">
          <p className="text-white-50 text-uppercase fw-semibold small mb-2">Your workspace</p>
          <h1 className="display-6 fw-semibold mb-2">Welcome to InternMatch</h1>
          <p className="mb-0 text-white-50">Your {label.toLowerCase()} account is ready to use.</p>
        </section>
        <div className="row g-4">
          <div className="col-md-7">
            <section className="card dashboard-stat h-100"><div className="card-body p-4">
              <p className="section-eyebrow mb-2">Signed-in account</p>
              <h2 className="h5 mb-2">{user?.email}</h2>
              <p className="text-muted mb-0">This is the account currently active in your browser.</p>
            </div></section>
          </div>
          <div className="col-md-5">
            <section className="card dashboard-stat h-100"><div className="card-body p-4">
              <p className="section-eyebrow mb-3">Account role</p>
              <span className="role-badge">{user?.role}</span>
            </div></section>
          </div>
        </div>
      </main>
    </>
  );
};
