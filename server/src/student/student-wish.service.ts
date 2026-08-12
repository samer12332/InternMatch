import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import type { ReplaceWishesInput } from "./student-wish.schemas";

const internshipSelect = {
    wishOrder: true,
    internship: {
        select: {
            id: true,
            title: true,
            description: true,
            major: true,
            minimumGpa: true,
            capacity: true,
            company: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
} as const;

const getStudentProfile = async (userId: string) => {
    const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId },
        select: { id: true },
    });

    if (!studentProfile) {
        throw new AppError("Student profile configuration is invalid", 500);
    }

    return studentProfile;
};

export const getStudentWishes = async (userId: string) => {
    const studentProfile = await getStudentProfile(userId);

    return prisma.application.findMany({
        where: { studentId: studentProfile.id },
        orderBy: { wishOrder: "asc" },
        select: internshipSelect,
    });
};

export const replaceStudentWishes = async (
    userId: string,
    input: ReplaceWishesInput,
) =>
    prisma.$transaction(async (transaction) => {
        const studentProfile = await transaction.studentProfile.findUnique({
            where: { userId },
            select: {
                id: true,
                major: true,
                gpa: true,
            },
        });

        if (!studentProfile) {
            throw new AppError("Student profile configuration is invalid", 500);
        }

        const eligibleInternships = await transaction.internship.findMany({
            where: {
                id: { in: input.internshipIds },
                major: {
                    equals: studentProfile.major,
                    mode: "insensitive",
                },
                minimumGpa: {
                    lte: studentProfile.gpa,
                },
            },
            select: { id: true },
        });

        if (eligibleInternships.length !== input.internshipIds.length) {
            throw new AppError(
                "One or more internships are unavailable or ineligible",
                400,
            );
        }

        const distributionResult = await transaction.distributionResult.findUnique(
            {
                where: { studentId: studentProfile.id },
                select: { id: true },
            },
        );

        if (distributionResult) {
            throw new AppError(
                "Cannot change wishes after the distribution has been run",
                409,
            );
        }

        await transaction.application.deleteMany({
            where: { studentId: studentProfile.id },
        });

        if (input.internshipIds.length > 0) {
            await transaction.application.createMany({
                data: input.internshipIds.map((internshipId, index) => ({
                    studentId: studentProfile.id,
                    internshipId,
                    wishOrder: index + 1,
                })),
            });
        }

        return transaction.application.findMany({
            where: { studentId: studentProfile.id },
            orderBy: { wishOrder: "asc" },
            select: internshipSelect,
        });
    });
