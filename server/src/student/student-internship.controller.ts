import type { RequestHandler } from "express";

import type { InternshipPaginationInput } from "./student-internship.schemas";
import { getEligibleInternships } from "./student-internship.service";

export const getEligibleInternshipsHandler: RequestHandler = async (
    req,
    res,
) => {
    const data = await getEligibleInternships(
        req.user!.id,
        res.locals.validatedQuery as InternshipPaginationInput,
    );

    res.status(200).json({
        success: true,
        data,
    });
};
