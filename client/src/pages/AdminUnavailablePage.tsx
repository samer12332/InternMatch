import { useCallback, useEffect, useState } from "react";
import {
    getDistributionResults,
    getDistributionSummary,
    runDistribution,
    type DistributionResult,
    type DistributionSummary,
} from "../api/distribution";
import { getApiErrorMessage } from "../api/errors";
import { AppNavbar } from "../components/AppNavbar";

const wishLabel = (order: number) =>
    ["1st Wish", "2nd Wish", "3rd Wish"][order - 1] ?? `Wish ${order}`;
const emptySummary: DistributionSummary = {
    totalStudents: 0,
    assigned: 0,
    unassigned: 0,
    firstWish: 0,
    secondWish: 0,
    thirdWish: 0,
};

export const AdminUnavailablePage = () => {
    const [summary, setSummary] = useState<DistributionSummary>(emptySummary);
    const [results, setResults] = useState<DistributionResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [nextSummary, nextResults] = await Promise.all([
                getDistributionSummary(),
                getDistributionResults(),
            ]);
            setSummary(nextSummary);
            setResults(nextResults);
        } catch (err) {
            setError(
                getApiErrorMessage(err, "Unable to load distribution data."),
            );
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);
    const run = async () => {
        setRunning(true);
        setError(null);
        setSuccess(null);
        try {
            setSummary(await runDistribution());
            setResults(await getDistributionResults());
            setSuccess(
                "Distribution completed and current results were replaced.",
            );
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to run distribution."));
        } finally {
            setRunning(false);
        }
    };
    const cards: Array<[string, number, string]> = [
        ["Students", summary.totalStudents, "Total student profiles"],
        ["Assigned", summary.assigned, "Received an internship"],
        ["Unassigned", summary.unassigned, "No internship assigned"],
        ["1st Wish", summary.firstWish, "First preference"],
        ["2nd Wish", summary.secondWish, "Second preference"],
        ["3rd Wish", summary.thirdWish, "Third preference"],
    ];
    return (
        <>
            <AppNavbar />
            <main className="container py-5 admin-page">
                <section className="admin-hero mb-4">
                    <div>
                        <p className="dashboard-hero-eyebrow mb-2">
                            Admin workspace
                        </p>
                        <h1 className="h2 text-white mb-2">
                            Distribution Dashboard
                        </h1>
                        <p className="text-white-50 mb-0">
                            Run the current allocation and review student
                            outcomes.
                        </p>
                    </div>
                    <button
                        className="btn btn-light fw-semibold"
                        disabled={running}
                        onClick={() => void run()}
                    >
                        {running ? "Running distribution…" : "Run Distribution"}
                    </button>
                </section>
                <p className="text-muted small mb-4">
                    Running distribution replaces the current results using the
                    existing ranking rules.
                </p>
                {error && (
                    <div className="alert alert-danger border-0 shadow-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success border-0 shadow-sm">
                        ✓ {success}
                    </div>
                )}
                {loading ? (
                    <div className="student-status-card">
                        <div className="spinner-border spinner-border-sm text-primary" />
                        <span>Loading distribution data…</span>
                    </div>
                ) : (
                    <>
                        <div className="row g-3 mb-4">
                            {cards.map(([label, value, detail]) => (
                                <div className="col-6 col-lg-4" key={label}>
                                    <section className="card admin-summary-card h-100">
                                        <div className="card-body p-3 p-md-4">
                                            <p className="section-eyebrow mb-2">
                                                {label}
                                            </p>
                                            <strong>{value}</strong>
                                            <span>{detail}</span>
                                        </div>
                                    </section>
                                </div>
                            ))}
                        </div>
                        <section className="card distribution-table-card">
                            <div className="card-body p-0">
                                <div className="p-4 border-bottom">
                                    <p className="section-eyebrow mb-1">
                                        Current allocation
                                    </p>
                                    <h2 className="h4 mb-0">
                                        Distribution Results
                                    </h2>
                                </div>
                                {results.length === 0 ? (
                                    <div className="student-status-card border-0">
                                        <strong>
                                            Distribution has not been run yet
                                        </strong>
                                        <span>
                                            Run distribution to create current
                                            results for all students.
                                        </span>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Student</th>
                                                    <th>Major</th>
                                                    <th>GPA</th>
                                                    <th>Status</th>
                                                    <th>Internship</th>
                                                    <th>Company</th>
                                                    <th>Preference</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.map((result) => (
                                                    <tr key={result.student.id}>
                                                        <td className="fw-semibold">
                                                            {
                                                                result.student
                                                                    .name
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                result.student
                                                                    .major
                                                            }
                                                        </td>
                                                        <td>
                                                            {result.student.gpa}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`status-pill ${result.status === "ASSIGNED" ? "assigned" : "unassigned"}`}
                                                            >
                                                                {result.status ===
                                                                "ASSIGNED"
                                                                    ? "Assigned"
                                                                    : "Unassigned"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {result.status ===
                                                            "ASSIGNED"
                                                                ? result
                                                                      .internship
                                                                      .title
                                                                : "—"}
                                                        </td>
                                                        <td>
                                                            {result.status ===
                                                            "ASSIGNED"
                                                                ? result
                                                                      .internship
                                                                      .company
                                                                      .name
                                                                : "—"}
                                                        </td>
                                                        <td>
                                                            {result.status ===
                                                            "ASSIGNED"
                                                                ? wishLabel(
                                                                      result.achievedWishOrder,
                                                                  )
                                                                : "—"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </>
    );
};
