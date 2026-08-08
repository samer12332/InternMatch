import type { RequestHandler } from "express";

import type { StudentSearchInput } from "./company-student.schemas";
import { getStudentProfileAndRecordView, getStudentProfileViewSummary, searchStudents } from "./company-student.service";

export const searchStudentsHandler: RequestHandler = async (_req, res) => {
  const data = await searchStudents(res.locals.validatedQuery as StudentSearchInput);
  res.status(200).json({ success: true, data });
};

export const getStudentProfileHandler: RequestHandler = async (req, res) => {
  const student = await getStudentProfileAndRecordView(req.user!.id, String(req.params.studentId));
  res.status(200).json({ success: true, data: { student } });
};

export const getProfileSummaryHandler: RequestHandler = async (req, res) => {
  const profileViews = await getStudentProfileViewSummary(req.user!.id);
  res.status(200).json({ success: true, data: { profileViews } });
};
