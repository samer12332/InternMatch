import axios from "axios";

export const getApiErrorMessage = (error: unknown, fallback = "Something went wrong. Please try again.") => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }

  return fallback;
};
