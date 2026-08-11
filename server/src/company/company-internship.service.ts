import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import type {
    CreateInternshipInput,
    UpdateInternshipInput,
} from "./company-internship.schemas";

const getCompanyProfileId = async (userId: string) => {
    const companyProfile = await prisma.companyProfile.findUnique({
        where: { userId },
        select: { id: true },
    });

    if (!companyProfile) {
        throw new AppError("Company profile configuration is invalid", 500);
    }

    return companyProfile.id;
};

const assertMajorPostingLimit = async (
    companyId: string,
    major: string,
    excludedInternshipId?: string,
) => {
    const internshipCount = await prisma.internship.count({
        where: {
            companyId,
            major: {
                equals: major,
                mode: "insensitive",
            },
            ...(excludedInternshipId
                ? { id: { not: excludedInternshipId } }
                : {}),
        },
    });

    if (internshipCount >= env.maxInternshipsPerMajor) {
        throw new AppError("Internship limit reached for this major", 409);
    }
};

export const createCompanyInternship = async (
    userId: string,
    input: CreateInternshipInput,
) => {
    const companyId = await getCompanyProfileId(userId);
    await assertMajorPostingLimit(companyId, input.major);

    return prisma.internship.create({
        data: {
            companyId,
            ...input,
        },
    });
};

export const getCompanyInternships = async (userId: string) => {
    const companyId = await getCompanyProfileId(userId);

    return prisma.internship.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
    });
};

export const updateCompanyInternship = async (
    userId: string,
    internshipId: string,
    input: UpdateInternshipInput,
) => {
    const companyId = await getCompanyProfileId(userId);
    const internship = await prisma.internship.findFirst({
        where: {
            id: internshipId,
            companyId,
        },
        select: { id: true },
    });

    if (!internship) {
        throw new AppError("Internship not found", 404);
    }

    if (input.major !== undefined) {
        await assertMajorPostingLimit(companyId, input.major, internship.id);
    }

    return prisma.internship.update({
        where: { id: internship.id },
        data: input,
    });
};
