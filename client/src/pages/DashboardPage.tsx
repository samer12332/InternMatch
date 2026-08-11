import { AppNavbar } from "../components/AppNavbar";
import { BrandLogo } from "../components/BrandLogo";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfileSummary } from "../api/student";
import { getApiErrorMessage } from "../api/errors";
import {
    getStudentDistributionResult,
    type StudentDistributionResult,
} from "../api/distribution";

export const DashboardPage = ({ role }: { role: "STUDENT" | "COMPANY" }) => {
    const { user, profile } = useAuth();
    const label = role === "STUDENT" ? "Student" : "Company";
    const [profileViews, setProfileViews] = useState<number | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [distributionResult, setDistributionResult] =
        useState<StudentDistributionResult | null>(null);
    const [distributionLoading, setDistributionLoading] = useState(false);
    const [distributionError, setDistributionError] = useState<string | null>(
        null,
    );
    useEffect(() => {
        if (role !== "STUDENT") return;
        void (async () => {
            try {
                setProfileViews((await getProfileSummary()).profileViews);
            } catch (err) {
                setProfileError(
                    getApiErrorMessage(err, "Unable to load profile views."),
                );
            }
        })();
    }, [role]);
    useEffect(() => {
        if (role !== "STUDENT") return;
        setDistributionLoading(true);
        void (async () => {
            try {
                setDistributionResult(await getStudentDistributionResult());
            } catch (err) {
                setDistributionError(
                    getApiErrorMessage(
                        err,
                        "Unable to load distribution result.",
                    ),
                );
            } finally {
                setDistributionLoading(false);
            }
        })();
    }, [role]);

    return (
        <>
            <AppNavbar />
            <main className="container py-5 dashboard-page">
                <section className="dashboard-hero mb-4">
                    <div>
                        <p className="dashboard-hero-eyebrow mb-2">
                            Your workspace
                        </p>
                        <h1 className="display-6 fw-semibold mb-2">
                            Welcome
                            {role === "STUDENT" && profile && "gpa" in profile
                                ? `, ${profile.name}`
                                : " to InternMatch"}
                        </h1>
                        <p className="mb-0 text-white-50">
                            Your {label.toLowerCase()} account is ready to use.
                        </p>
                    </div>
                    <div className="dashboard-hero-mark">
                        <BrandLogo variant="hero" iconOnly />
                    </div>
                </section>
                <div className="row g-4">
                    <div className="col-md-7">
                        <section className="card dashboard-stat dashboard-account-card h-100">
                            <div className="card-body p-4">
                                <div
                                    className="dashboard-card-icon dashboard-card-icon-primary"
                                    aria-hidden="true"
                                >
                                    @
                                </div>
                                <p className="section-eyebrow mb-2">
                                    Signed-in account
                                </p>
                                <h2 className="h5 text-break mb-2">
                                    {user?.email}
                                </h2>
                                <p className="text-muted mb-0">
                                    This is the account currently active in your
                                    browser.
                                </p>
                            </div>
                        </section>
                    </div>
                    <div className="col-md-5">
                        <section className="card dashboard-stat dashboard-role-card h-100">
                            <div className="card-body p-4">
                                <div
                                    className="dashboard-card-icon dashboard-card-icon-soft"
                                    aria-hidden="true"
                                >
                                    ◆
                                </div>
                                <p className="section-eyebrow mb-3">
                                    Account role
                                </p>
                                <span className="role-badge">{user?.role}</span>
                                <p className="text-muted small mt-3 mb-0">
                                    Your account permissions are set for this
                                    role.
                                </p>
                            </div>
                        </section>
                    </div>
                    {role === "STUDENT" && profile && "gpa" in profile && (
                        <div className="col-12">
                            <section className="card student-dashboard-profile">
                                <div className="card-body p-4 p-md-5">
                                    <div className="d-flex flex-column flex-md-row justify-content-between gap-4">
                                        <div>
                                            <p className="section-eyebrow mb-2">
                                                My profile
                                            </p>
                                            <h2 className="h4 mb-1">
                                                {profile.name}
                                            </h2>
                                            <p className="text-muted mb-0">
                                                {profile.major} · {profile.city}
                                            </p>
                                        </div>
                                        <div className="dashboard-profile-details">
                                            <span>
                                                <small>GPA</small>
                                                <strong>
                                                    {profile.gpa} / 4.00
                                                </strong>
                                            </span>
                                            <span>
                                                <small>Major</small>
                                                <strong>{profile.major}</strong>
                                            </span>
                                            <span>
                                                <small>City</small>
                                                <strong>{profile.city}</strong>
                                            </span>
                                        </div>
                                    </div>
                                    {profile.bio && (
                                        <p className="student-bio mt-4 mb-0">
                                            {profile.bio}
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                    {role === "STUDENT" && (
                        <div className="col-12">
                            <section className="card distribution-result-card">
                                <div className="card-body p-4 p-md-5">
                                    <p className="section-eyebrow mb-2">
                                        Distribution result
                                    </p>
                                    <h2 className="h4 mb-3">
                                        Your internship allocation
                                    </h2>
                                    {distributionLoading ? (
                                        <p className="text-muted mb-0">
                                            Loading your result…
                                        </p>
                                    ) : distributionError ? (
                                        <p className="text-danger mb-0">
                                            {distributionError}
                                        </p>
                                    ) : distributionResult?.status ===
                                      "ASSIGNED" ? (
                                        <div>
                                            <span className="status-pill assigned mb-3">
                                                Assigned ·{" "}
                                                {distributionResult.achievedWishOrder ===
                                                1
                                                    ? "1st Wish"
                                                    : distributionResult.achievedWishOrder ===
                                                        2
                                                      ? "2nd Wish"
                                                      : "3rd Wish"}
                                            </span>
                                            <h3 className="h5 mb-1">
                                                {
                                                    distributionResult
                                                        .internship.title
                                                }
                                            </h3>
                                            <p className="text-muted mb-0">
                                                {
                                                    distributionResult
                                                        .internship.company.name
                                                }{" "}
                                                ·{" "}
                                                {
                                                    distributionResult
                                                        .internship.major
                                                }
                                            </p>
                                        </div>
                                    ) : distributionResult?.status ===
                                      "UNASSIGNED" ? (
                                        <p className="text-muted mb-0">
                                            Not assigned to an internship.
                                        </p>
                                    ) : (
                                        <p className="text-muted mb-0">
                                            Distribution has not been run yet.
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                    {role === "STUDENT" && (
                        <div className="col-12">
                            <section className="card dashboard-profile-card">
                                <div className="card-body p-4 p-md-5">
                                    <div className="dashboard-profile-content">
                                        <div className="dashboard-profile-stat">
                                            <p className="section-eyebrow mb-2">
                                                Profile visibility
                                            </p>
                                            <div className="d-flex align-items-baseline gap-2">
                                                <h2 className="dashboard-view-count mb-0">
                                                    {profileViews ?? "—"}
                                                </h2>
                                                <span className="text-muted">
                                                    views
                                                </span>
                                            </div>
                                            {profileError ? (
                                                <p className="text-danger small mt-3 mb-0">
                                                    {profileError}
                                                </p>
                                            ) : (
                                                <p className="text-muted mt-3 mb-0">
                                                    Companies have viewed your
                                                    profile this many times.
                                                </p>
                                            )}
                                        </div>
                                        <div className="dashboard-quick-actions">
                                            <p className="fw-semibold mb-2">
                                                Continue your search
                                            </p>
                                            <div className="d-flex flex-wrap gap-2">
                                                <Link
                                                    className="btn btn-primary"
                                                    to="/student/internships"
                                                >
                                                    Browse internships{" "}
                                                    <span aria-hidden="true">
                                                        →
                                                    </span>
                                                </Link>
                                                <Link
                                                    className="btn btn-outline-secondary"
                                                    to="/student/wishes"
                                                >
                                                    Manage my wishes
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                    {role === "COMPANY" && (
                        <div className="col-12">
                            <section className="card dashboard-profile-card">
                                <div className="card-body p-4 p-md-5">
                                    <div className="dashboard-profile-content">
                                        <div className="dashboard-profile-stat">
                                            <p className="section-eyebrow mb-2">
                                                Company workspace
                                            </p>
                                            <h2 className="h3 mb-2">
                                                Manage your opportunities
                                            </h2>
                                            <p className="text-muted mt-3 mb-0">
                                                Publish internships and find
                                                students whose profiles fit your
                                                opportunities.
                                            </p>
                                        </div>
                                        <div className="dashboard-quick-actions">
                                            <p className="fw-semibold mb-2">
                                                Get started
                                            </p>
                                            <div className="d-flex flex-wrap gap-2">
                                                <Link
                                                    className="btn btn-primary"
                                                    to="/company/internships"
                                                >
                                                    My Internships{" "}
                                                    <span aria-hidden="true">
                                                        →
                                                    </span>
                                                </Link>
                                                <Link
                                                    className="btn btn-outline-secondary"
                                                    to="/company/students"
                                                >
                                                    Search Students
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};
