import type { Prisma } from "@prisma/client";

import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import type { StudentSearchInput } from "./company-student.schemas";
import { email } from "zod";

const studentProfileSelect = {
    id: true,
    name: true,
    city: true,
    gpa: true,
    major: true,
    bio: true,
    // user: {
    //   select: {
    //     email: true
    //   }
    // }
} as const;

export const searchStudents = async ({
    page,
    limit,
    major,
    city,
    minGpa,
    bio,
}: StudentSearchInput) => {
    const where: Prisma.StudentProfileWhereInput = {
        ...(major ? { major: { equals: major, mode: "insensitive" } } : {}),
        ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
        ...(minGpa !== undefined ? { gpa: { gte: minGpa } } : {}),
        ...(bio ? { bio: { contains: bio, mode: "insensitive" } } : {}),
    };

    const [total, items] = await Promise.all([
        prisma.studentProfile.count({ where }),
        prisma.studentProfile.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            select: studentProfileSelect,
        }),
    ]);

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: total === 0 ? 0 : Math.ceil(total / limit),
        },
    };
};

export const getStudentProfileAndRecordView = async (
    userId: string,
    studentId: string,
) =>
    prisma.$transaction(async (transaction) => {
        const [companyProfile, studentProfile] = await Promise.all([
            transaction.companyProfile.findUnique({
                where: { userId },
                select: { id: true },
            }),
            transaction.studentProfile.findUnique({
                where: { id: studentId },
                select: studentProfileSelect,
            }),
        ]);

        if (!companyProfile)
            throw new AppError("Company profile configuration is invalid", 500);
        if (!studentProfile) throw new AppError("Student not found", 404);

        await transaction.profileView.create({
            data: {
                studentId: studentProfile.id,
                companyId: companyProfile.id,
            },
        });
        return studentProfile;
    });

export const getStudentProfileViewSummary = async (userId: string) => {
    const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId },
        select: { id: true },
    });
    if (!studentProfile)
        throw new AppError("Student profile configuration is invalid", 500);
    return prisma.profileView.count({
        where: { studentId: studentProfile.id },
    });
};
