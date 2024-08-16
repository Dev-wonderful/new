import { Profiles, Users } from "@prisma/client";

export enum UserRoles {
  SUPER_ADMIN = "superadmin",
  ADMIN = "admin",
  USER = "resident",
}

export interface IUserService {
  getUserById(id: string): Promise<Users | null>;
  getAllUsers(): Promise<Users[]>;
}

export interface IOrgService {}

export interface IRole {
  role: "super_admin" | "admin" | "user";
}
type OptionalValues = "createdAt" | "updatedAt" | "id";
export type NewProfile = Omit<Profiles, OptionalValues>;
export type NewUser = Omit<Users, OptionalValues | "deletedAt">;

export interface IUserSignUp {
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone_number: string;
  email: string;
  password: string;
  estate: string;
  avatarUrl: string;
  address: string;
}
export interface IUserLogin {
  email: string;
  password: string;
}

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface IAuthService {
  // login(payload: IUserLogin): Promise<unknown>;
  signUp(payload: IUserSignUp, res: unknown): Promise<unknown>;
  verifyEmail(token: string, email: string): Promise<unknown>;
  // changePassword(
  //   userId: string,
  //   oldPassword: string,
  //   newPassword: string,
  //   confirmPassword: string,
  // ): Promise<{ message: string }>;
  // generateMagicLink(email: string): Promise<{ ok: boolean; message: string }>;
  // validateMagicLinkToken(
  //   token: string,
  // ): Promise<{ status: string; email: string; userId: string }>;
  // passwordlessLogin(userId: string): Promise<{ access_token: string }>;
}

export interface ICreateOrganisation {
  name: string;
  description: string;
  email: string;
  industry: string;
  type: string;
  country: string;
  address: string;
  state: string;
}

export interface IOrganisationService {
  createOrganisation(
    payload: ICreateOrganisation,
    userId: string,
  ): Promise<unknown>;
  removeUser(org_id: string, user_id: string): Promise<Users | null>;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: Users;
  }
}

export interface EmailQueuePayload {
  templateId: string;
  recipient: string;
  variables?: Record<string, any>;
}

export interface GoogleUser {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  sub: string;
}
