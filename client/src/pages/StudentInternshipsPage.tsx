import { useCallback, useEffect, useState } from "react";

import { AppNavbar } from "../components/AppNavbar";
import { getApiErrorMessage } from "../api/errors";
import { getEligibleInternships, getWishes, replaceWishes, type Internship, type Pagination, type Wish } from "../api/student";

export const StudentInternshipsPage = () => {
  const [page, setPage] = useState(1);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [internshipData, wishData] = await Promise.all([getEligibleInternships(page), getWishes()]);
      setInternships(internshipData.items); setPagination(internshipData.pagination); setWishes(wishData);
    } catch (err) { setError(getApiErrorMessage(err, "Unable to load eligible internships.")); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { void load(); }, [load]);

  const addWish = async (internshipId: string) => {
    if (wishes.some((wish) => wish.internship.id === internshipId) || wishes.length >= 3) return;
    setAddingId(internshipId); setError(null);
    try { setWishes(await replaceWishes([...wishes.map((wish) => wish.internship.id), internshipId])); }
    catch (err) { setError(getApiErrorMessage(err, "Unable to add this internship to your wishes.")); }
    finally { setAddingId(null); }
  };

  return <><AppNavbar /><main className="container py-5 student-page">
    <section className="student-page-header mb-4">
      <div><p className="section-eyebrow mb-2">Student opportunities</p><h1 className="h2 mb-2">Eligible Internships</h1><p className="text-muted mb-0">Explore placements matched to your major and GPA.</p></div>
      <div className="wish-progress" aria-label={`${wishes.length} of 3 wishes selected`}><span className="wish-progress-count">{wishes.length}<small>/3</small></span><span className="wish-progress-label">Wishes selected</span></div>
    </section>
    <div className="wish-progress-track mb-4" aria-hidden="true"><span style={{ width: `${(wishes.length / 3) * 100}%` }} /></div>
    {wishes.length >= 3 && <div className="alert alert-info border-0 shadow-sm">You have selected all 3 wishes. Remove one from My Wishes to add another.</div>}
    {error && <div className="alert alert-danger border-0 shadow-sm" role="alert">{error}</div>}
    {loading ? <div className="student-status-card"><div className="spinner-border spinner-border-sm text-primary" role="status" /><span>Loading eligible internships…</span></div> : internships.length === 0 ? <div className="student-status-card"><strong>No eligible internships yet</strong><span>Check back later for new placements matched to your profile.</span></div> : <div className="row g-4">
      {internships.map((internship) => {
        const selected = wishes.some((wish) => wish.internship.id === internship.id);
        return <div className="col-12" key={internship.id}><article className="card internship-card"><div className="card-body p-4 p-md-4">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3"><div><p className="company-label mb-2">{internship.company.name}</p><h2 className="h4 mb-0">{internship.title}</h2></div>
            {selected ? <span className="selected-wish align-self-md-start">✓ Added to wishes</span> : <button className="btn btn-primary px-3 align-self-md-start" disabled={addingId !== null || wishes.length >= 3} onClick={() => void addWish(internship.id)}>{addingId === internship.id ? "Adding…" : "Add to wishes"}</button>}
          </div><p className="internship-description mb-4">{internship.description}</p><div className="internship-meta"><span><small>Major</small>{internship.major}</span><span><small>Minimum GPA</small>{internship.minimumGpa}</span><span><small>Capacity</small>{internship.capacity} {internship.capacity === 1 ? "student" : "students"}</span></div>
        </div></article></div>;
      })}
    </div>}
    {pagination && pagination.totalPages > 1 && <nav className="pagination-bar mt-4" aria-label="Internship pages"><button className="btn btn-outline-secondary" disabled={page === 1 || loading} onClick={() => setPage((current) => current - 1)}>← Previous</button><span>Page <strong>{pagination.page}</strong> of {pagination.totalPages}</span><button className="btn btn-outline-secondary" disabled={page === pagination.totalPages || loading} onClick={() => setPage((current) => current + 1)}>Next →</button></nav>}
  </main></>;
};
