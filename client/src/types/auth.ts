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
    profile: StudentAuthProfile | CompanyAuthProfile | null;
};

export type StudentAuthProfile = {
    name: string;
    city: string;
    gpa: number | string;
    major: string;
    bio: string;
};

export type CompanyAuthProfile = {
    name: string;
};
