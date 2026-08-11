import { api } from "./client";

export type DistributionSummary = {
    totalStudents: number;
    assigned: number;
    unassigned: number;
    firstWish: number;
    secondWish: number;
    thirdWish: number;
};
export type DistributionResult =
    | {
          student: {
              id: string;
              name: string;
              major: string;
              gpa: number | string;
          };
          status: "ASSIGNED";
          achievedWishOrder: number;
          internship: {
              id: string;
              title: string;
              major: string;
              company: { name: string };
          };
      }
    | {
          student: {
              id: string;
              name: string;
              major: string;
              gpa: number | string;
          };
          status: "UNASSIGNED";
      };
export type StudentDistributionResult =
    | { status: "NOT_RUN" }
    | { status: "UNASSIGNED" }
    | {
          status: "ASSIGNED";
          achievedWishOrder: number;
          internship: {
              id: string;
              title: string;
              major: string;
              company: { id: string; name: string };
          };
      };

export const getDistributionSummary = async () =>
    (
        await api.get<{ success: true; data: DistributionSummary }>(
            "/admin/distribution/summary",
        )
    ).data.data;
export const getDistributionResults = async () =>
    (
        await api.get<{
            success: true;
            data: { results: DistributionResult[] };
        }>("/admin/distribution/results")
    ).data.data.results;
export const runDistribution = async () =>
    (
        await api.post<{ success: true; data: DistributionSummary }>(
            "/admin/distribution/run",
        )
    ).data.data;
export const getStudentDistributionResult = async () =>
    (
        await api.get<{ success: true; data: StudentDistributionResult }>(
            "/students/me/distribution-result",
        )
    ).data.data;
