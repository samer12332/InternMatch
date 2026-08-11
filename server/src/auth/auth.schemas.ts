import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .email("A valid email is required")
    .transform((value) => value.toLowerCase());
const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters");
const requiredText = (field: string, maxLength: number) =>
    z
        .string()
        .trim()
        .min(1, `${field} is required`)
        .max(maxLength, `${field} is too long`);

export const studentRegistrationSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        nationalId: z
            .string()
            .regex(/^\d{14}$/, "National ID must contain exactly 14 digits"),
        name: requiredText("Name", 100),
        city: requiredText("City", 100),
        gpa: z
            .number()
            .min(0, "GPA must be at least 0")
            .max(4, "GPA must be at most 4"),
        major: requiredText("Major", 120),
        bio: requiredText("Bio", 500),
    })
    .strict();

export const companyRegistrationSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        name: requiredText("Company name", 150),
    })
    .strict();

export const loginSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
    })
    .strict();

export type StudentRegistrationInput = z.infer<
    typeof studentRegistrationSchema
>;
export type CompanyRegistrationInput = z.infer<
    typeof companyRegistrationSchema
>;
export type LoginInput = z.infer<typeof loginSchema>;
