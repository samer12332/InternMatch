import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import type { InternshipPaginationInput } from "./student-internship.schemas";

export const getEligibleInternships = async (
  userId: string,
  { page, limit }: InternshipPaginationInput,
) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: {
      major: true,
      gpa: true,
    },
  });

  if (!studentProfile) {
    throw new AppError("Student profile configuration is invalid", 500);
  }

  const where = {
    major: {
      equals: studentProfile.major,
      mode: "insensitive" as const,
    },
    minimumGpa: {
      lte: studentProfile.gpa,
    },
  };

  const [total, items] = await Promise.all([
    prisma.internship.count({ where }),
    prisma.internship.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        major: true,
        minimumGpa: true,
        capacity: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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
