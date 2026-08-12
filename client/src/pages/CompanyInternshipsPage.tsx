import { useEffect, useState } from "react";
import { AppNavbar } from "../components/AppNavbar";
import { InternshipForm } from "../components/InternshipForm";
import {
    createCompanyInternship,
    deleteCompanyInternship,
    getCompanyInternships,
    updateCompanyInternship,
    type CompanyInternship,
    type InternshipInput,
} from "../api/company";
import { getApiErrorMessage } from "../api/errors";

export const CompanyInternshipsPage = () => {
    const [internships, setInternships] = useState<CompanyInternship[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editing, setEditing] = useState<
        CompanyInternship | null | undefined
    >(undefined);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const load = async () => {
        setLoading(true);
        try {
            setInternships(await getCompanyInternships());
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to load internships."));
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        void load();
    }, []);
    const save = async (input: InternshipInput) => {
        setSaving(true);
        setError(null);
        setSuccess(null);
        try {
            const item = editing
                ? await updateCompanyInternship(editing.id, input)
                : await createCompanyInternship(input);
            setInternships((current) =>
                editing
                    ? current.map((internship) =>
                          internship.id === item.id ? item : internship,
                      )
                    : [item, ...current],
            );
            setEditing(undefined);
            setSuccess(editing ? "Internship updated." : "Internship created.");
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to save internship."));
        } finally {
            setSaving(false);
        }
    };
    const remove = async (internship: CompanyInternship) => {
        if (
            !window.confirm(
                `Delete the internship posting \"${internship.title}\"? This cannot be undone.`,
            )
        ) {
            return;
        }

        setDeletingId(internship.id);
        setError(null);
        setSuccess(null);
        try {
            await deleteCompanyInternship(internship.id);
            setInternships((current) =>
                current.filter((item) => item.id !== internship.id),
            );
            if (editing?.id === internship.id) {
                setEditing(undefined);
            }
            setSuccess("Internship deleted.");
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to delete internship."));
        } finally {
            setDeletingId(null);
        }
    };
    return (
        <>
            <AppNavbar />
            <main className="container py-5 company-page">
                <div className="student-page-header mb-4">
                    <div>
                        <p className="section-eyebrow mb-2">
                            Company workspace
                        </p>
                        <h1 className="h2 mb-2">My Internships</h1>
                        <p className="text-muted mb-0">
                            Create and manage your internship postings.
                        </p>
                    </div>
                    <div className="page-count">
                        <strong>{internships.length}</strong>{" "}
                        {internships.length === 1 ? "posting" : "postings"}
                    </div>
                    <button
                        className="btn btn-primary px-3"
                        onClick={() => {
                            setEditing(null);
                            setError(null);
                            setSuccess(null);
                        }}
                    >
                        + Add Internship
                    </button>
                </div>
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
                {editing !== undefined && (
                    <InternshipForm
                        internship={editing}
                        saving={saving}
                        onCancel={() => setEditing(undefined)}
                        onSave={save}
                    />
                )}
                {loading ? (
                    <div className="student-status-card">
                        <div className="spinner-border spinner-border-sm text-primary" />
                        <span>Loading internships…</span>
                    </div>
                ) : internships.length === 0 ? (
                    <div className="student-status-card company-empty-state">
                        <strong>No internships posted yet</strong>
                        <span>
                            Create your first internship to begin receiving
                            eligible student wishes.
                        </span>
                        <button
                            className="btn btn-primary mt-2"
                            onClick={() => setEditing(null)}
                        >
                            Create internship
                        </button>
                    </div>
                ) : (
                    <div className="vstack gap-3">
                        {internships.map((internship) => (
                            <article
                                className="card internship-card company-internship-card"
                                key={internship.id}
                            >
                                <div className="card-body p-4">
                                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                                        <div>
                                            <p className="company-label mb-2">
                                                {internship.major}
                                            </p>
                                            <h2 className="h4 mb-2">
                                                {internship.title}
                                            </h2>
                                            <p className="internship-description mb-4">
                                                {internship.description}
                                            </p>
                                        </div>
                                        <div className="d-flex gap-2 align-self-md-start">
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => {
                                                    setEditing(internship);
                                                    setError(null);
                                                    setSuccess(null);
                                                }}
                                                disabled={deletingId === internship.id}
                                            >
                                                Edit posting
                                            </button>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => void remove(internship)}
                                                disabled={deletingId === internship.id}
                                            >
                                                {deletingId === internship.id
                                                    ? "Deleting…"
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="internship-meta">
                                        <span>
                                            <small>Minimum GPA</small>
                                            {internship.minimumGpa} / 4.00
                                        </span>
                                        <span>
                                            <small>Capacity</small>
                                            {internship.capacity}{" "}
                                            {internship.capacity === 1
                                                ? "student"
                                                : "students"}
                                        </span>
                                        <span>
                                            <small>Created</small>
                                            {new Date(
                                                internship.createdAt,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
};
