import { api } from "./client";
import type { Pagination } from "./student";

export type CompanyInternship = {
    id: string;
    title: string;
    description: string;
    major: string;
    minimumGpa: number;
    capacity: number;
    createdAt: string;
};
export type InternshipInput = Pick<
    CompanyInternship,
    "title" | "description" | "major" | "minimumGpa" | "capacity"
>;
export type StudentProfile = {
    id: string;
    name: string;
    email: string;
    city: string;
    gpa: number;
    major: string;
    bio: string;
};
export type StudentFilters = {
    major: string;
    city: string;
    minGpa: string;
    bio: string;
};

type ApiInternship = Omit<CompanyInternship, "minimumGpa" | "capacity"> & {
    minimumGpa: number | string;
    capacity: number | string;
};

const toInternship = (internship: ApiInternship): CompanyInternship => ({
    ...internship,
    minimumGpa: Number(internship.minimumGpa),
    capacity: Number(internship.capacity),
});
const toInternshipPayload = (input: InternshipInput): InternshipInput => ({
    ...input,
    minimumGpa: Number(input.minimumGpa),
    capacity: Number(input.capacity),
});

export const getCompanyInternships = async () =>
    (
        await api.get<{
            success: true;
            data: { internships: ApiInternship[] };
        }>("/company/internships")
    ).data.data.internships.map(toInternship);
export const createCompanyInternship = async (input: InternshipInput) =>
    toInternship(
        (
            await api.post<{
                success: true;
                data: { internship: ApiInternship };
            }>("/company/internships", toInternshipPayload(input))
        ).data.data.internship,
    );
export const updateCompanyInternship = async (
    id: string,
    input: InternshipInput,
) =>
    toInternship(
        (
            await api.patch<{
                success: true;
                data: { internship: ApiInternship };
            }>(`/company/internships/${id}`, toInternshipPayload(input))
        ).data.data.internship,
    );
export const deleteCompanyInternship = async (id: string) => {
    await api.delete(`/company/internships/${id}`);
};
export const searchStudents = async (filters: StudentFilters, page: number) =>
    (
        await api.get<{
            success: true;
            data: { items: StudentProfile[]; pagination: Pagination };
        }>("/company/students", {
            params: {
                page,
                limit: 10,
                ...(filters.major.trim()
                    ? { major: filters.major.trim() }
                    : {}),
                ...(filters.city.trim() ? { city: filters.city.trim() } : {}),
                ...(filters.bio.trim() ? { bio: filters.bio.trim() } : {}),
                ...(filters.minGpa.trim() ? { minGpa: filters.minGpa } : {}),
            },
        })
    ).data.data;
export const getStudentProfile = async (id: string) =>
    (
        await api.get<{ success: true; data: { student: StudentProfile } }>(
            `/company/students/${id}`,
        )
    ).data.data.student;
