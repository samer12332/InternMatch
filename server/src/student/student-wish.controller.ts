import type { RequestHandler } from "express";

import type { ReplaceWishesInput } from "./student-wish.schemas";
import { getStudentWishes, replaceStudentWishes } from "./student-wish.service";

export const getStudentWishesHandler: RequestHandler = async (req, res) => {
    const wishes = await getStudentWishes(req.user!.id);

    res.status(200).json({
        success: true,
        data: { wishes },
    });
};

export const replaceStudentWishesHandler: RequestHandler = async (req, res) => {
    const wishes = await replaceStudentWishes(
        req.user!.id,
        req.body as ReplaceWishesInput,
    );

    res.status(200).json({
        success: true,
        data: { wishes },
    });
};
