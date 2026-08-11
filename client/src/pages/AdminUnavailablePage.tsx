import { AppNavbar } from "../components/AppNavbar";

export const AdminUnavailablePage = () => (
    <>
        <AppNavbar />
        <main className="container py-5">
            <section
                className="card access-card mx-auto"
                style={{ maxWidth: "42rem" }}
            >
                <div className="card-body p-4 p-md-5">
                    <p className="section-eyebrow mb-2">Admin access</p>
                    <h1 className="h3">This workspace is coming later</h1>
                    <p className="text-muted mb-0">
                        The admin dashboard is not included in the current
                        release.
                    </p>
                </div>
            </section>
        </main>
    </>
);
