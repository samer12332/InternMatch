import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { CompanyInternship, InternshipInput } from "../api/company";

const emptyForm: InternshipInput = {
    title: "",
    description: "",
    major: "",
    minimumGpa: 0,
    capacity: 1,
};

export const InternshipForm = ({
    internship,
    saving,
    onCancel,
    onSave,
}: {
    internship: CompanyInternship | null;
    saving: boolean;
    onCancel: () => void;
    onSave: (input: InternshipInput) => Promise<void>;
}) => {
    const [form, setForm] = useState<InternshipInput>(emptyForm);
    useEffect(
        () =>
            setForm(
                internship
                    ? {
                          title: internship.title,
                          description: internship.description,
                          major: internship.major,
                          minimumGpa: internship.minimumGpa,
                          capacity: internship.capacity,
                      }
                    : emptyForm,
            ),
        [internship],
    );
    const submit = (event: FormEvent) => {
        event.preventDefault();
        void onSave(form);
    };
    return (
        <form
            className="card company-form-card internship-form mb-4"
            onSubmit={submit}
        >
            <div className="card-body p-4 p-md-5">
                <div className="form-heading">
                    <div className="form-heading-icon" aria-hidden="true">
                        {internship ? "✎" : "+"}
                    </div>
                    <div>
                        <p className="section-eyebrow mb-1">
                            Internship details
                        </p>
                        <h2 className="h4 mb-1">
                            {internship
                                ? "Edit internship"
                                : "Create an internship"}
                        </h2>
                        <p className="text-muted small mb-0">
                            Fields marked with * are required.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn-close ms-auto"
                        onClick={onCancel}
                        disabled={saving}
                        aria-label="Close form"
                    />
                </div>
                <div className="row g-4 mt-1">
                    <div className="col-md-7">
                        <label className="form-label" htmlFor="title">
                            Internship title *
                        </label>
                        <input
                            id="title"
                            required
                            placeholder="e.g. Frontend Engineering Intern"
                            className="form-control"
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-md-5">
                        <label className="form-label" htmlFor="major">
                            Required major *
                        </label>
                        <input
                            id="major"
                            required
                            placeholder="e.g. Computer Science"
                            className="form-control"
                            value={form.major}
                            onChange={(e) =>
                                setForm({ ...form, major: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label" htmlFor="description">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            required
                            placeholder="Describe the internship responsibilities and learning opportunity."
                            className="form-control"
                            rows={5}
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="minimumGpa">
                            Minimum GPA *
                        </label>
                        <div className="input-group">
                            <input
                                id="minimumGpa"
                                required
                                type="number"
                                min="0"
                                max="4"
                                step="0.01"
                                className="form-control"
                                value={form.minimumGpa}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        minimumGpa: Number(e.target.value),
                                    })
                                }
                            />
                            <span className="input-group-text">/ 4.00</span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="capacity">
                            Student capacity *
                        </label>
                        <input
                            id="capacity"
                            required
                            type="number"
                            min="1"
                            step="1"
                            className="form-control"
                            value={form.capacity}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    capacity: Number(e.target.value),
                                })
                            }
                        />
                        <div className="form-text">
                            The number of students this internship can accept.
                        </div>
                    </div>
                </div>
                <div className="form-actions mt-5">
                    <button className="btn btn-primary px-4" disabled={saving}>
                        {saving
                            ? "Saving…"
                            : internship
                              ? "Save changes"
                              : "Create internship"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-link text-decoration-none text-muted"
                        disabled={saving}
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};
