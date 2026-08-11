import { z } from "zod";

export const replaceWishesSchema = z
    .object({
        internshipIds: z
            .array(z.string().uuid("Each internship ID must be a valid UUID"))
            .max(3, "A maximum of 3 wishes is allowed"),
    })
    .strict()
    .refine(
        ({ internshipIds }) =>
            new Set(internshipIds).size === internshipIds.length,
        "Duplicate internship IDs are not allowed",
    );

export type ReplaceWishesInput = z.infer<typeof replaceWishesSchema>;
