import { z } from "zod";

const optionalText = (field: string, maxLength: number) =>
  z.string().trim().min(1, `${field} must not be empty`).max(maxLength, `${field} is too long`).optional();

export const studentSearchSchema = z
  .object({
    major: optionalText("Major", 100),
    city: optionalText("City", 100),
    minGpa: z.coerce.number().min(0, "Minimum GPA must be at least 0").max(4, "Minimum GPA must be at most 4").optional(),
    bio: optionalText("Bio", 1000),
    page: z.coerce.number().int("Page must be an integer").positive("Page must be positive").default(1),
    limit: z.coerce.number().int("Limit must be an integer").positive("Limit must be positive").max(50, "Limit must not exceed 50").default(10),
  })
  .strict();

export const studentIdParamsSchema = z.object({
  studentId: z.string().uuid("Invalid student ID"),
});

export type StudentSearchInput = z.infer<typeof studentSearchSchema>;
