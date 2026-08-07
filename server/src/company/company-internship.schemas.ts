import { z } from "zod";

const requiredText = (field: string, maxLength: number) =>
  z.string().trim().min(1, `${field} is required`).max(maxLength, `${field} is too long`);

const minimumGpaSchema = z
  .number()
  .min(0, "Minimum GPA must be at least 0")
  .max(4, "Minimum GPA must be at most 4");

const capacitySchema = z.number().int("Capacity must be an integer").positive("Capacity must be positive");

export const createInternshipSchema = z
  .object({
    title: requiredText("Title", 120),
    description: requiredText("Description", 1000),
    major: requiredText("Major", 100),
    minimumGpa: minimumGpaSchema,
    capacity: capacitySchema,
  })
  .strict();

export const updateInternshipSchema = createInternshipSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field must be provided")
  .strict();

export const internshipIdParamsSchema = z.object({
  id: z.string().uuid("Invalid internship ID"),
});

export type CreateInternshipInput = z.infer<typeof createInternshipSchema>;
export type UpdateInternshipInput = z.infer<typeof updateInternshipSchema>;
