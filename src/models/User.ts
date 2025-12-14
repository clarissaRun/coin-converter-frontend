export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export type CreateUser = Omit<User, "id" | "createdAt" | "updatedAt"> & {
  password: string;
};

export interface LoginResponse {
  access_token: string;
  user?: User;
}
export interface LoginCredentials {
  email: string;
  password: string;
}
