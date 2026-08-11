import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../api/client";
import { getApiErrorMessage } from "../api/errors";
import { BrandLogo } from "../components/BrandLogo";

export const RegisterCompanyPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);

        try {
            await api.post("/auth/register/company", {
                email: formData.get("email"),
                password: formData.get("password"),
                name: formData.get("name"),
            });
            navigate("/login", {
                replace: true,
                state: {
                    message:
                        "Company registration successful. You can now sign in.",
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
            <section className="card shadow-sm auth-card">
                <div className="card-body p-4 p-md-5">
                    <Link
                        className="auth-brand-link mb-4"
                        to="/"
                        aria-label="InternMatch home"
                    >
                        <BrandLogo variant="auth" />
                    </Link>
                    <p className="auth-eyebrow mb-2">Company account</p>
                    <h1 className="h2 mb-2">Meet emerging talent</h1>
                    <p className="text-muted mb-4">
                        Create a company account to join InternMatch.
                    </p>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="name">
                                Company name
                            </label>
                            <input
                                className="form-control"
                                id="name"
                                name="name"
                                maxLength={150}
                                required
                            />
                        </div>
                        <div className="mb-3">
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
                        <div className="mb-4">
                            <label className="form-label" htmlFor="password">
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
                        <button
                            className="btn btn-primary w-100 py-2"
                            disabled={isSubmitting}
                            type="submit"
                        >
                            {isSubmitting
                                ? "Creating account…"
                                : "Create company account"}
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
