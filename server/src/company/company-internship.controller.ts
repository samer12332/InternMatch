import type { RequestHandler } from "express";

import type {
    CreateInternshipInput,
    UpdateInternshipInput,
} from "./company-internship.schemas";
import {
    createCompanyInternship,
    deleteCompanyInternship,
    getCompanyInternships,
    updateCompanyInternship,
} from "./company-internship.service";

export const createInternshipHandler: RequestHandler = async (req, res) => {
    const internship = await createCompanyInternship(
        req.user!.id,
        req.body as CreateInternshipInput,
    );

    res.status(201).json({
        success: true,
        data: { internship },
    });
};

export const getInternshipsHandler: RequestHandler = async (req, res) => {
    const internships = await getCompanyInternships(req.user!.id);

    res.status(200).json({
        success: true,
        data: { internships },
    });
};

export const updateInternshipHandler: RequestHandler = async (req, res) => {
    const internshipId = String(req.params.id);
    const internship = await updateCompanyInternship(
        req.user!.id,
        internshipId,
        req.body as UpdateInternshipInput,
    );

    res.status(200).json({
        success: true,
        data: { internship },
    });
};

export const deleteInternshipHandler: RequestHandler = async (req, res) => {
    await deleteCompanyInternship(req.user!.id, String(req.params.id));

    res.status(204).send();
};
