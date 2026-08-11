import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getStudentProfile, type StudentProfile } from "../api/company";
import { getApiErrorMessage } from "../api/errors";
import { AppNavbar } from "../components/AppNavbar";

export const CompanyStudentProfilePage = () => {
  const { studentId } = useParams();
  const fetched = useRef(false);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (!studentId || fetched.current) return; fetched.current = true; void (async () => { try { setStudent(await getStudentProfile(studentId)); } catch (err) { setError(getApiErrorMessage(err, "Unable to load this student profile.")); } })(); }, [studentId]);
  return <><AppNavbar /><main className="container py-5 company-page"><Link className="back-link mb-4" to="/company/students">← Back to student search</Link>{error ? <div className="alert alert-danger border-0 shadow-sm">{error}</div> : !student ? <div className="student-status-card"><div className="spinner-border spinner-border-sm text-primary" /><span>Loading student profile…</span></div> : <article className="card student-profile-card overflow-hidden"><div className="student-profile-banner"><div className="student-avatar" aria-hidden="true">{student.name.charAt(0).toUpperCase()}</div><div><p className="text-white-50 text-uppercase fw-semibold small mb-1">Student profile</p><h1 className="h2 text-white mb-1">{student.name}</h1><p className="text-white-50 mb-0">{student.major} · {student.city}</p></div></div><div className="card-body p-4 p-md-5"><div className="profile-stat-grid mb-5"><div><small>GPA</small><strong>{student.gpa}<em>/4.00</em></strong></div><div><small>Major</small><strong>{student.major}</strong></div><div><small>Location</small><strong>{student.city}</strong></div></div><section><p className="section-eyebrow mb-2">About the student</p><h2 className="h4 mb-3">Profile summary</h2><p className="student-bio profile-bio mb-0">{student.bio || "No biography has been added yet."}</p></section></div></article>}</main></>;
};
