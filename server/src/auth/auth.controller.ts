import type { RequestHandler } from "express";

import type {
  CompanyRegistrationInput,
  LoginInput,
  StudentRegistrationInput,
} from "./auth.schemas";
import {
  getCurrentUser,
  login,
  registerCompany,
  registerStudent,
} from "./auth.service";

export const registerStudentHandler: RequestHandler = async (req, res) => {
  const user = await registerStudent(req.body as StudentRegistrationInput);

  res.status(201).json({
    success: true,
    data: { user },
  });
};

export const registerCompanyHandler: RequestHandler = async (req, res) => {
  const user = await registerCompany(req.body as CompanyRegistrationInput);

  res.status(201).json({
    success: true,
    data: { user },
  });
};

export const loginHandler: RequestHandler = async (req, res) => {
  const data = await login(req.body as LoginInput);

  res.status(200).json({
    success: true,
    data,
  });
};

export const meHandler: RequestHandler = async (req, res) => {
  const data = await getCurrentUser(req.user!.id);

  res.status(200).json({
    success: true,
    data,
  });
};
