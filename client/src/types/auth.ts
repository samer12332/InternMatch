export type UserRole = "STUDENT" | "COMPANY" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type CurrentUserResponse = {
  user: AuthUser;
  profile: unknown;
};
