import type { RequestHandler } from "express";
import {
    getDistributionResults,
    getDistributionSummary,
    getStudentDistributionResult,
    runDistribution,
} from "./distribution.service";

export const runDistributionHandler: RequestHandler = async (_req, res) => {
    res.status(200).json({ success: true, data: await runDistribution() });
};
export const getDistributionSummaryHandler: RequestHandler = async (
    _req,
    res,
) => {
    res.status(200).json({
        success: true,
        data: await getDistributionSummary(),
    });
};
export const getDistributionResultsHandler: RequestHandler = async (
    _req,
    res,
) => {
    res.status(200).json({
        success: true,
        data: { results: await getDistributionResults() },
    });
};
export const getStudentDistributionResultHandler: RequestHandler = async (
    req,
    res,
) => {
    res.status(200).json({
        success: true,
        data: await getStudentDistributionResult(req.user!.id),
    });
};
