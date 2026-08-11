import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { allocateApplications } from "./distribution.algorithm";

type DistributionSummary = {
    totalStudents: number;
    assigned: number;
    unassigned: number;
    firstWish: number;
    secondWish: number;
    thirdWish: number;
};

const emptySummary = (): DistributionSummary => ({
    totalStudents: 0,
    assigned: 0,
    unassigned: 0,
    firstWish: 0,
    secondWish: 0,
    thirdWish: 0,
});

const summarize = (
    results: Array<{ application: { wishOrder: number } | null }>,
): DistributionSummary => {
    const summary = emptySummary();
    summary.totalStudents = results.length;
    for (const result of results) {
        if (!result.application) {
            summary.unassigned += 1;
            continue;
        }
        summary.assigned += 1;
        if (result.application.wishOrder === 1) summary.firstWish += 1;
        if (result.application.wishOrder === 2) summary.secondWish += 1;
        if (result.application.wishOrder === 3) summary.thirdWish += 1;
    }
    return summary;
};

export const runDistribution = async (): Promise<DistributionSummary> =>
    prisma.$transaction(async (transaction) => {
        const [students, internships] = await Promise.all([
            transaction.studentProfile.findMany({
                select: {
                    id: true,
                    gpa: true,
                    applications: {
                        where: { wishOrder: { in: [1, 2, 3] } },
                        select: {
                            id: true,
                            internshipId: true,
                            wishOrder: true,
                            createdAt: true,
                        },
                    },
                },
            }),
            transaction.internship.findMany({
                select: { id: true, capacity: true },
            }),
        ]);
        const assignedApplicationByStudent = allocateApplications(
            students.map((student) => ({
                ...student,
                gpa: Number(student.gpa),
            })),
            internships,
        );
        await transaction.distributionResult.deleteMany();
        await transaction.distributionResult.createMany({
            data: students.map((student) => ({
                studentId: student.id,
                applicationId:
                    assignedApplicationByStudent.get(student.id) ?? null,
            })),
        });
        const results = students.map((student) => {
            const applicationId = assignedApplicationByStudent.get(student.id);
            const application = applicationId
                ? (student.applications.find(
                      (item) => item.id === applicationId,
                  ) ?? null)
                : null;
            return { application };
        });
        return summarize(results);
    });

export const getDistributionSummary = async () =>
    summarize(
        await prisma.distributionResult.findMany({
            select: { application: { select: { wishOrder: true } } },
        }),
    );

export const getDistributionResults = async () =>
    prisma.distributionResult
        .findMany({
            orderBy: { student: { name: "asc" } },
            select: {
                student: {
                    select: { id: true, name: true, major: true, gpa: true },
                },
                application: {
                    select: {
                        wishOrder: true,
                        internship: {
                            select: {
                                id: true,
                                title: true,
                                major: true,
                                company: { select: { name: true } },
                            },
                        },
                    },
                },
            },
        })
        .then((results) =>
            results.map((result) =>
                result.application
                    ? {
                          student: result.student,
                          status: "ASSIGNED" as const,
                          achievedWishOrder: result.application.wishOrder,
                          internship: result.application.internship,
                      }
                    : {
                          student: result.student,
                          status: "UNASSIGNED" as const,
                      },
            ),
        );

export const getStudentDistributionResult = async (userId: string) => {
    const student = await prisma.studentProfile.findUnique({
        where: { userId },
        select: { id: true },
    });
    if (!student)
        throw new AppError("Student profile configuration is invalid", 500);
    const result = await prisma.distributionResult.findUnique({
        where: { studentId: student.id },
        select: {
            application: {
                select: {
                    wishOrder: true,
                    internship: {
                        select: {
                            id: true,
                            title: true,
                            major: true,
                            company: { select: { id: true, name: true } },
                        },
                    },
                },
            },
        },
    });
    if (!result) return { status: "NOT_RUN" as const };
    if (!result.application) return { status: "UNASSIGNED" as const };
    return {
        status: "ASSIGNED" as const,
        achievedWishOrder: result.application.wishOrder,
        internship: result.application.internship,
    };
};
