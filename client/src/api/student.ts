import { api } from "./client";

export type Internship = {
    id: string;
    title: string;
    description: string;
    major: string;
    minimumGpa: number;
    capacity: number;
    company: { id: string; name: string };
};

export type Wish = {
    wishOrder: number;
    internship: Internship;
};

export type Pagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export const getProfileSummary = async () =>
    (
        await api.get<{ success: true; data: { profileViews: number } }>(
            "/students/me/profile-summary",
        )
    ).data.data;

export const getEligibleInternships = async (page: number) =>
    (
        await api.get<{
            success: true;
            data: { items: Internship[]; pagination: Pagination };
        }>("/students/me/internships", {
            params: { page, limit: 10 },
        })
    ).data.data;

export const getWishes = async () =>
    (
        await api.get<{ success: true; data: { wishes: Wish[] } }>(
            "/students/me/wishes",
        )
    ).data.data.wishes;

export const replaceWishes = async (internshipIds: string[]) =>
    (
        await api.put<{ success: true; data: { wishes: Wish[] } }>(
            "/students/me/wishes",
            { internshipIds },
        )
    ).data.data.wishes;
