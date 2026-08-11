import { useEffect, useState } from "react";

import { AppNavbar } from "../components/AppNavbar";
import { getApiErrorMessage } from "../api/errors";
import { getWishes, replaceWishes, type Wish } from "../api/student";

const preferenceLabel = (index: number) => ["1st Wish", "2nd Wish", "3rd Wish"][index] ?? `${index + 1}th Wish`;

export const StudentWishesPage = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null); const [success, setSuccess] = useState<string | null>(null);
  const [movingWish, setMovingWish] = useState<{ id: string; direction: -1 | 1 } | null>(null);
  useEffect(() => { void (async () => { try { setWishes(await getWishes()); } catch (err) { setError(getApiErrorMessage(err, "Unable to load your wishes.")); } finally { setLoading(false); } })(); }, []);
  const move = (index: number, direction: -1 | 1) => {
    const wish = wishes[index];
    if (!wish || movingWish) return;
    setMovingWish({ id: wish.internship.id, direction });
    setWishes((current) => { const next = [...current]; [next[index], next[index + direction]] = [next[index + direction], next[index]]; return next; });
    window.setTimeout(() => setMovingWish(null), 360);
  };
  const remove = (index: number) => setWishes((current) => current.filter((_, currentIndex) => currentIndex !== index));
  const save = async () => { setSaving(true); setError(null); setSuccess(null); try { setWishes(await replaceWishes(wishes.map((wish) => wish.internship.id))); setSuccess("Wishes saved."); } catch (err) { setError(getApiErrorMessage(err, "Unable to save your wishes.")); } finally { setSaving(false); } };
  return <><AppNavbar /><main className="container py-5 student-page"><section className="student-page-header mb-4"><div><p className="section-eyebrow mb-2">Your preferences</p><h1 className="h2 mb-2">My Wishes</h1><p className="text-muted mb-0">Rank up to three internships in your preferred order.</p></div><button className="btn btn-primary px-3" disabled={loading || saving} onClick={() => void save()}>{saving ? "Saving…" : "Save Wishes"}</button></section>
    <div className="wish-save-note mb-4"><span>Changes are saved only when you select <strong>Save Wishes</strong>.</span><span>{wishes.length}/3 selected</span></div>
    {error && <div className="alert alert-danger border-0 shadow-sm" role="alert">{error}</div>}{success && <div className="alert alert-success border-0 shadow-sm" role="status">✓ {success}</div>}
    {loading ? <div className="student-status-card"><div className="spinner-border spinner-border-sm text-primary" role="status" /><span>Loading your wishes…</span></div> : wishes.length === 0 ? <div className="student-status-card"><strong>Your wish list is empty</strong><span>Browse eligible internships to add your first preference.</span></div> : <div className="vstack gap-3">{wishes.map((wish, index) => <article className={`card wish-card${movingWish?.id === wish.internship.id ? movingWish.direction === -1 ? " wish-card-moving-up" : " wish-card-moving-down" : ""}`} key={wish.internship.id}><div className="card-body p-4 d-flex flex-column flex-md-row align-items-md-center gap-3"><div className="wish-number">{index + 1}</div><div className="flex-grow-1"><p className="section-eyebrow mb-1">{preferenceLabel(index)}</p><h2 className="h5 mb-1">{wish.internship.title}</h2><p className="text-muted mb-0">{wish.internship.company.name}</p></div><div className="wish-actions align-self-md-center"><button className="btn btn-outline-secondary btn-sm" disabled={saving || movingWish !== null || index === 0} onClick={() => move(index, -1)}>↑ <span className="d-none d-sm-inline">Move Up</span></button><button className="btn btn-outline-secondary btn-sm" disabled={saving || movingWish !== null || index === wishes.length - 1} onClick={() => move(index, 1)}>↓ <span className="d-none d-sm-inline">Move Down</span></button><button className="btn btn-outline-danger btn-sm" disabled={saving || movingWish !== null} onClick={() => remove(index)}>Remove</button></div></div></article>)}</div>}
  </main></>;
};
