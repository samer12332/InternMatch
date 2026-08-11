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
const resultsPerPage = 10;

export const AdminUnavailablePage = () => {
    const [summary, setSummary] = useState<DistributionSummary>(emptySummary);
    const [results, setResults] = useState<DistributionResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [resultsPage, setResultsPage] = useState(1);
    const [studentQuery, setStudentQuery] = useState("");
    const [majorFilter, setMajorFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<"" | "ASSIGNED" | "UNASSIGNED">("");
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
            setResultsPage(1);
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
            setResultsPage(1);
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
    const majors = [...new Set(results.map((result) => result.student.major))].sort();
    const filteredResults = results.filter((result) =>
        result.student.name.toLowerCase().includes(studentQuery.trim().toLowerCase()) &&
        (!majorFilter || result.student.major === majorFilter) &&
        (!statusFilter || result.status === statusFilter),
    );
    const totalResultPages = Math.ceil(filteredResults.length / resultsPerPage);
    const visibleResults = filteredResults.slice(
        (resultsPage - 1) * resultsPerPage,
        resultsPage * resultsPerPage,
    );
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
                                {results.length > 0 && (
                                    <div className="p-4 border-bottom bg-light-subtle">
                                        <div className="row g-2">
                                            <div className="col-md-5"><input className="form-control" placeholder="Search student name" value={studentQuery} onChange={(event) => { setStudentQuery(event.target.value); setResultsPage(1); }} /></div>
                                            <div className="col-md-4"><select className="form-select" value={majorFilter} onChange={(event) => { setMajorFilter(event.target.value); setResultsPage(1); }}><option value="">All majors</option>{majors.map((major) => <option key={major} value={major}>{major}</option>)}</select></div>
                                            <div className="col-md-3"><select className="form-select" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as "" | "ASSIGNED" | "UNASSIGNED"); setResultsPage(1); }}><option value="">All statuses</option><option value="ASSIGNED">Assigned</option><option value="UNASSIGNED">Unassigned</option></select></div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center gap-2 mt-3"><span className="small text-muted">{filteredResults.length} matching {filteredResults.length === 1 ? "result" : "results"}</span><button className="btn btn-link btn-sm text-decoration-none" onClick={() => { setStudentQuery(""); setMajorFilter(""); setStatusFilter(""); setResultsPage(1); }}>Clear filters</button></div>
                                    </div>
                                )}
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
                                ) : filteredResults.length === 0 ? (
                                    <div className="student-status-card border-0"><strong>No matching results</strong><span>Try changing or clearing the filters.</span></div>
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
                                                {visibleResults.map(
                                                    (result) => (
                                                        <tr
                                                            key={
                                                                result.student
                                                                    .id
                                                            }
                                                        >
                                                            <td className="fw-semibold">
                                                                {
                                                                    result
                                                                        .student
                                                                        .name
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    result
                                                                        .student
                                                                        .major
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    result
                                                                        .student
                                                                        .gpa
                                                                }
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
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {totalResultPages > 1 && (
                                    <nav
                                        className="pagination-bar p-4 border-top"
                                        aria-label="Distribution result pages"
                                    >
                                        <button
                                            className="btn btn-outline-secondary"
                                            disabled={resultsPage === 1}
                                            onClick={() =>
                                                setResultsPage(
                                                    (page) => page - 1,
                                                )
                                            }
                                        >
                                            ← Previous
                                        </button>
                                        <span>
                                            Page <strong>{resultsPage}</strong>{" "}
                                            of {totalResultPages}
                                        </span>
                                        <button
                                            className="btn btn-outline-secondary"
                                            disabled={
                                                resultsPage === totalResultPages
                                            }
                                            onClick={() =>
                                                setResultsPage(
                                                    (page) => page + 1,
                                                )
                                            }
                                        >
                                            Next →
                                        </button>
                                    </nav>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </>
    );
};
