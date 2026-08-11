import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../api/client";
import { getApiErrorMessage } from "../api/errors";

export const RegisterStudentPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);

        try {
            await api.post("/auth/register/student", {
                email: formData.get("email"),
                password: formData.get("password"),
                nationalId: formData.get("nationalId"),
                name: formData.get("name"),
                city: formData.get("city"),
                gpa: Number(formData.get("gpa")),
                major: formData.get("major"),
                bio: formData.get("bio"),
            });
            navigate("/login", {
                replace: true,
                state: {
                    message: "Registration successful. You can now sign in.",
                },
            });
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to register."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth-page container py-5">
            <section className="card auth-card auth-card-wide">
                <div className="card-body p-4 p-md-5">
                    <div className="d-flex align-items-center gap-2 mb-4">
                        <span className="brand-mark">IM</span>
                        <span className="brand-label fw-semibold fs-5">
                            InternMatch
                        </span>
                    </div>
                    <p className="auth-eyebrow mb-2">Student account</p>
                    <h1 className="h2 mb-2">Start your journey</h1>
                    <p className="text-muted mb-4">
                        Create a profile to take part in internship matching.
                    </p>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                />
                            </div>
                            <div className="col-12">
                                <label
                                    className="form-label"
                                    htmlFor="password"
                                >
                                    Password
                                </label>
                                <input
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    type="password"
                                    minLength={8}
                                    maxLength={72}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    maxLength={100}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label
                                    className="form-label"
                                    htmlFor="nationalId"
                                >
                                    National ID
                                </label>
                                <input
                                    className="form-control"
                                    id="nationalId"
                                    name="nationalId"
                                    inputMode="numeric"
                                    pattern="[0-9]{14}"
                                    minLength={14}
                                    maxLength={14}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="city">
                                    City
                                </label>
                                <input
                                    className="form-control"
                                    id="city"
                                    name="city"
                                    maxLength={100}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="gpa">
                                    GPA
                                </label>
                                <input
                                    className="form-control"
                                    id="gpa"
                                    name="gpa"
                                    type="number"
                                    min="0"
                                    max="4"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label" htmlFor="major">
                                    Major
                                </label>
                                <input
                                    className="form-control"
                                    id="major"
                                    name="major"
                                    maxLength={120}
                                    required
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label" htmlFor="bio">
                                    Bio
                                </label>
                                <textarea
                                    className="form-control"
                                    id="bio"
                                    name="bio"
                                    rows={3}
                                    maxLength={500}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            className="btn btn-primary w-100 py-2 mt-4"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            {isSubmitting
                                ? "Creating account…"
                                : "Create student account"}
                        </button>
                    </form>
                    <p className="mb-0 mt-4 text-center small">
                        Already registered? <Link to="/login">Sign in</Link>.
                    </p>
                </div>
            </section>
        </main>
    );
};
