import { describe, expect, it } from "vitest";
import { isMajorPostingLimitReached } from "../company/posting-limit";
import { allocateApplications } from "../distribution/distribution.algorithm";
import { isInternshipEligible } from "../student/eligibility";
import { replaceWishesSchema } from "../student/student-wish.schemas";

const id = (value: string) =>
    `${value.padEnd(8, "0")}-0000-4000-8000-000000000000`;
const app = (
    value: string,
    internshipId: string,
    wishOrder: number,
    minute = 0,
) => ({
    id: value,
    internshipId,
    wishOrder,
    createdAt: new Date(Date.UTC(2026, 0, 1, 0, minute)),
});

describe("student eligibility", () => {
    it("requires case-insensitive major equality and a sufficient GPA", () => {
        expect(
            isInternshipEligible(
                { major: "Computer Science", gpa: 3.2 },
                { major: "computer science", minimumGpa: 3 },
            ),
        ).toBe(true);
        expect(
            isInternshipEligible(
                { major: "Computer Science", gpa: 2.9 },
                { major: "Computer Science", minimumGpa: 3 },
            ),
        ).toBe(false);
        expect(
            isInternshipEligible(
                { major: "Information Systems", gpa: 4 },
                { major: "Computer Science", minimumGpa: 2.4 },
            ),
        ).toBe(false);
    });
});

describe("wish input", () => {
    it("rejects more than three wishes and duplicate internship IDs", () => {
        expect(
            replaceWishesSchema.safeParse({
                internshipIds: [id("1"), id("2"), id("3"), id("4")],
            }).success,
        ).toBe(false);
        expect(
            replaceWishesSchema.safeParse({ internshipIds: [id("1"), id("1")] })
                .success,
        ).toBe(false);
    });
});

describe("company posting limit", () => {
    it("counts the same major case-insensitively", () => {
        expect(
            isMajorPostingLimitReached(
                ["Computer Science", "computer science", "Information Systems"],
                "COMPUTER SCIENCE",
                2,
            ),
        ).toBe(true);
    });
});

describe("distribution allocation", () => {
    it("gives a limited same-round seat to the higher GPA", () => {
        const winner = allocateApplications(
            [
                { id: "a", gpa: 3.4, applications: [app("a1", "x", 1)] },
                { id: "b", gpa: 3.9, applications: [app("b1", "x", 1)] },
            ],
            [{ id: "x", capacity: 1 }],
        );
        expect(winner.get("b")).toBe("b1");
        expect(winner.has("a")).toBe(false);
    });
    it("falls back to a second wish and never exceeds capacity", () => {
        const winners = allocateApplications(
            [
                { id: "high", gpa: 4, applications: [app("h1", "x", 1)] },
                {
                    id: "fallback",
                    gpa: 3,
                    applications: [app("f1", "x", 1), app("f2", "y", 2)],
                },
                { id: "other", gpa: 3.5, applications: [app("o1", "y", 1)] },
            ],
            [
                { id: "x", capacity: 1 },
                { id: "y", capacity: 1 },
            ],
        );
        expect(winners.get("high")).toBe("h1");
        expect(winners.get("other")).toBe("o1");
        expect(winners.has("fallback")).toBe(false);
        expect(
            [...winners.values()].filter((value) => value === "h1").length,
        ).toBeLessThanOrEqual(1);
    });
    it("keeps a first-wish winner ahead of a higher-GPA second wish", () => {
        const winners = allocateApplications(
            [
                {
                    id: "first",
                    gpa: 3.4,
                    applications: [app("first1", "x", 1)],
                },
                {
                    id: "second",
                    gpa: 3.9,
                    applications: [
                        app("second1", "y", 1),
                        app("second2", "x", 2),
                    ],
                },
            ],
            [
                { id: "x", capacity: 1 },
                { id: "y", capacity: 0 },
            ],
        );
        expect(winners.get("first")).toBe("first1");
        expect(winners.has("second")).toBe(false);
    });
});
