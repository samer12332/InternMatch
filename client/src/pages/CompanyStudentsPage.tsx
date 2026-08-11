import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { AppNavbar } from "../components/AppNavbar";
import {
    searchStudents,
    type StudentFilters,
    type StudentProfile,
} from "../api/company";
import { getApiErrorMessage } from "../api/errors";
import type { Pagination } from "../api/student";
const emptyFilters: StudentFilters = {
    major: "",
    city: "",
    minGpa: "",
    bio: "",
};
export const CompanyStudentsPage = () => {
    const [draft, setDraft] = useState(emptyFilters);
    const [filters, setFilters] = useState(emptyFilters);
    const [page, setPage] = useState(1);
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await searchStudents(filters, page);
            setStudents(data.items);
            setPagination(data.pagination);
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to load students."));
        } finally {
            setLoading(false);
        }
    }, [filters, page]);
    useEffect(() => {
        void load();
    }, [load]);
    const submit = (event: FormEvent) => {
        event.preventDefault();
        setHasSearched(true);
        setPage(1);
        setFilters(draft);
    };
    const clear = () => {
        setDraft(emptyFilters);
        setFilters(emptyFilters);
        setHasSearched(false);
        setPage(1);
    };
    return (
        <>
            <AppNavbar />
            <main className="container py-5 company-page">
                <div className="mb-4">
                    <p className="section-eyebrow mb-2">Student directory</p>
                    <h1 className="h2 mb-2">Search Students</h1>
                    <p className="text-muted mb-0">
                        Find profiles that fit your internship opportunities.
                    </p>
                </div>
                <form
                    className="card company-form-card search-panel mb-4"
                    onSubmit={submit}
                >
                    <div className="card-body p-4">
                        <div className="search-panel-heading">
                            <div>
                                <h2 className="h5 mb-1">Refine your search</h2>
                                <p className="text-muted small mb-0">
                                    All filters are optional. Combine them to
                                    narrow results.
                                </p>
                            </div>
                            <span className="search-panel-badge">
                                Student directory
                            </span>
                        </div>
                        <div className="row g-3 mt-1">
                            <div className="col-md-6 col-lg-3">
                                <label className="form-label">Major</label>
                                <input
                                    placeholder="e.g. Computer Science"
                                    className="form-control"
                                    value={draft.major}
                                    onChange={(e) =>
                                        setDraft({
                                            ...draft,
                                            major: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <label className="form-label">City</label>
                                <input
                                    placeholder="e.g. Cairo"
                                    className="form-control"
                                    value={draft.city}
                                    onChange={(e) =>
                                        setDraft({
                                            ...draft,
                                            city: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <label className="form-label">
                                    Minimum GPA
                                </label>
                                <input
                                    placeholder="0.00 – 4.00"
                                    type="number"
                                    min="0"
                                    max="4"
                                    step="0.01"
                                    className="form-control"
                                    value={draft.minGpa}
                                    onChange={(e) =>
                                        setDraft({
                                            ...draft,
                                            minGpa: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <label className="form-label">
                                    Bio contains
                                </label>
                                <input
                                    placeholder="Skills or interests"
                                    className="form-control"
                                    value={draft.bio}
                                    onChange={(e) =>
                                        setDraft({
                                            ...draft,
                                            bio: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="d-flex gap-2 mt-4">
                            <button className="btn btn-primary px-4">
                                Search students
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={clear}
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                </form>
                {error && (
                    <div className="alert alert-danger border-0 shadow-sm">
                        {error}
                    </div>
                )}
                {hasSearched && !loading && !error && (
                    <div
                        className="alert alert-success border-0 shadow-sm search-success"
                        role="status"
                    >
                        ✓ Search complete — found{" "}
                        {pagination?.total ?? students.length} matching{" "}
                        {(pagination?.total ?? students.length) === 1
                            ? "student"
                            : "students"}
                        .
                    </div>
                )}
                {loading ? (
                    <div className="student-status-card">
                        <div className="spinner-border spinner-border-sm text-primary" />
                        <span>Loading students…</span>
                    </div>
                ) : students.length === 0 ? (
                    <div className="student-status-card">
                        <strong>No students found</strong>
                        <span>
                            Try adjusting or clearing your search filters.
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="results-summary mb-3">
                            <strong>
                                {pagination?.total ?? students.length}
                            </strong>{" "}
                            matching{" "}
                            {pagination?.total === 1 ? "student" : "students"}
                        </div>
                        <div className="row g-3">
                            {students.map((student) => (
                                <div className="col-md-6" key={student.id}>
                                    <article className="card student-result-card h-100">
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between gap-3">
                                                <div>
                                                    <p className="company-label mb-2">
                                                        {student.major}
                                                    </p>
                                                    <h2 className="h5 mb-1">
                                                        {student.name}
                                                    </h2>
                                                    <p className="text-muted mb-3">
                                                        {student.city} · GPA{" "}
                                                        {student.gpa}
                                                    </p>
                                                </div>
                                                <span
                                                    className="student-result-avatar"
                                                    aria-hidden="true"
                                                >
                                                    {student.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="student-bio mb-4">
                                                {student.bio ||
                                                    "No biography has been added yet."}
                                            </p>
                                            <Link
                                                className="btn btn-outline-primary btn-sm"
                                                to={`/company/students/${student.id}`}
                                            >
                                                View Profile →
                                            </Link>
                                        </div>
                                    </article>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {pagination && pagination.totalPages > 1 && (
                    <nav className="pagination-bar mt-4">
                        <button
                            className="btn btn-outline-secondary"
                            disabled={page === 1 || loading}
                            onClick={() => setPage(page - 1)}
                        >
                            ← Previous
                        </button>
                        <span>
                            Page <strong>{pagination.page}</strong> of{" "}
                            {pagination.totalPages}
                        </span>
                        <button
                            className="btn btn-outline-secondary"
                            disabled={page === pagination.totalPages || loading}
                            onClick={() => setPage(page + 1)}
                        >
                            Next →
                        </button>
                    </nav>
                )}
            </main>
        </>
    );
};
