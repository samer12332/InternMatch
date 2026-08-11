import { z } from "zod";

export const internshipPaginationSchema = z
    .object({
        page: z.coerce
            .number()
            .int("Page must be an integer")
            .positive("Page must be positive")
            .default(1),
        limit: z.coerce
            .number()
            .int("Limit must be an integer")
            .positive("Limit must be positive")
            .max(50, "Limit must not exceed 50")
            .default(10),
    })
    .strict();

export type InternshipPaginationInput = z.infer<
    typeof internshipPaginationSchema
>;
