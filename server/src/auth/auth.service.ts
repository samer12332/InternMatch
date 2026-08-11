import { Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import type {
    CompanyRegistrationInput,
    LoginInput,
    StudentRegistrationInput,
} from "./auth.schemas";

const bcryptRounds = 12;

const safeUserSelect = {
    id: true,
    email: true,
    role: true,
} as const;

const isUniqueConstraintError = (error: unknown) =>
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002";

const createAccessToken = (user: { id: string; role: UserRole }) =>
    jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
    });

export const registerStudent = async (input: StudentRegistrationInput) => {
    try {
        const passwordHash = await bcrypt.hash(input.password, bcryptRounds);

        return await prisma.user.create({
            data: {
                email: input.email,
                passwordHash,
                role: UserRole.STUDENT,
                studentProfile: {
                    create: {
                        nationalId: input.nationalId,
                        name: input.name,
                        city: input.city,
                        gpa: input.gpa,
                        major: input.major,
                        bio: input.bio,
                    },
                },
            },
            select: safeUserSelect,
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new AppError(
                "An account with this email or national ID already exists",
                409,
            );
        }

        throw error;
    }
};

export const registerCompany = async (input: CompanyRegistrationInput) => {
    try {
        const passwordHash = await bcrypt.hash(input.password, bcryptRounds);

        return await prisma.user.create({
            data: {
                email: input.email,
                passwordHash,
                role: UserRole.COMPANY,
                companyProfile: {
                    create: {
                        name: input.name,
                    },
                },
            },
            select: safeUserSelect,
        });
    } catch (error) {
        if (isUniqueConstraintError(error)) {
            throw new AppError(
                "An account with this email already exists",
                409,
            );
        }

        throw error;
    }
};

export const login = async (input: LoginInput) => {
    const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: {
            ...safeUserSelect,
            passwordHash: true,
        },
    });

    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
        throw new AppError("Invalid email or password", 401);
    }

    return {
        accessToken: createAccessToken(user),
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    };
};

export const getCurrentUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            ...safeUserSelect,
            studentProfile: true,
            companyProfile: true,
        },
    });

    if (!user) {
        throw new AppError("Authentication is required", 401);
    }

    const hasStudentProfile = user.studentProfile !== null;
    const hasCompanyProfile = user.companyProfile !== null;
    const hasValidProfileConfiguration =
        (user.role === UserRole.STUDENT &&
            hasStudentProfile &&
            !hasCompanyProfile) ||
        (user.role === UserRole.COMPANY &&
            hasCompanyProfile &&
            !hasStudentProfile) ||
        (user.role === UserRole.ADMIN &&
            !hasStudentProfile &&
            !hasCompanyProfile);

    if (!hasValidProfileConfiguration) {
        throw new AppError("User profile configuration is invalid", 500);
    }

    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        profile: user.studentProfile ?? user.companyProfile,
    };
};
