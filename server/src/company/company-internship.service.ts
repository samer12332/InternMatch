import { Prisma } from "@prisma/client";

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
    transaction: Prisma.TransactionClient,
    companyId: string,
    major: string,
    excludedInternshipId?: string,
) => {
    const internshipCount = await transaction.internship.count({
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

const maxSerializationRetries = 3;

const runPostingLimitTransaction = async <T>(
    operation: (transaction: Prisma.TransactionClient) => Promise<T>,
) => {
    for (let attempt = 0; attempt < maxSerializationRetries; attempt += 1) {
        try {
            return await prisma.$transaction(operation, {
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            });
        } catch (error) {
            const isSerializationFailure =
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2034";

            if (
                !isSerializationFailure ||
                attempt === maxSerializationRetries - 1
            ) {
                if (isSerializationFailure) {
                    throw new AppError(
                        "Unable to create internship due to concurrent changes; please try again",
                        409,
                    );
                }
                throw error;
            }
        }
    }

    throw new AppError("Unable to create internship; please try again", 409);
};

export const createCompanyInternship = async (
    userId: string,
    input: CreateInternshipInput,
) => {
    const companyId = await getCompanyProfileId(userId);

    return runPostingLimitTransaction(async (transaction) => {
        await assertMajorPostingLimit(transaction, companyId, input.major);

        return transaction.internship.create({
            data: {
                companyId,
                ...input,
            },
        });
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
    return runPostingLimitTransaction(async (transaction) => {
        const internship = await transaction.internship.findFirst({
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
            await assertMajorPostingLimit(
                transaction,
                companyId,
                input.major,
                internship.id,
            );
        }

        return transaction.internship.update({
            where: { id: internship.id },
            data: input,
        });
    });
};

export const deleteCompanyInternship = async (
    userId: string,
    internshipId: string,
) => {
    const companyId = await getCompanyProfileId(userId);

    try {
        await prisma.$transaction(async (tx) => {
            const internship = await tx.internship.findFirst({
                where: {
                    id: internshipId,
                    companyId,
                },
                select: { id: true },
            });

            if (!internship) {
                throw new AppError("Internship not found", 404);
            }

            const application = await tx.application.findFirst({
                where: { internshipId: internship.id },
                select: { id: true },
            });

            if (application) {
                throw new AppError(
                    "Cannot delete an internship with existing student wishes",
                    409,
                );
            }

            await tx.internship.delete({ where: { id: internship.id } });
        });
    } catch (error) {
        // A simultaneous wish creation is still protected by the restrictive
        // foreign key; present that expected race as the same business rule.
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2003"
        ) {
            throw new AppError(
                "Cannot delete an internship with existing student wishes",
                409,
            );
        }

        throw error;
    }
};
