import {
  Prisma,
  PrismaClient,
  Profiles,
  USER_STATUS,
  Users,
} from "@prisma/client";
import { NewProfile, NewUser } from "../types";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export default class UsersModel {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  estate: string;
  status: USER_STATUS;
  profile: Profiles;
  private static _prisma: PrismaClient;

  constructor({ name, email, password, role, estate, status }: NewUser) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.estate = estate;
    this.status = status;
  }

  static set prisma(prismaClient: PrismaClient) {
    if (!(prismaClient instanceof PrismaClient)) {
      throw new Error("Invalid PrismaClient");
    }
    this._prisma = prismaClient;
  }

  // static get prisma () {
  // 	return this._prisma;
  // }

  Query = () => UsersModel._prisma.users;
  static Query = () => this._prisma.users;

  save = async () => {
    const user = await this.Query().create({
      data: {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
        estate: this.estate,
        status: this.status,
      },
    });
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
    this.id = user.id;
    return user;
  };

  addProfile = async (profile: NewProfile) => {
    delete profile["userId"];
    const user = await this.Query().update({
      where: { email: this.email },
      data: {
        profile: {
          create: { ...profile },
        },
      },
      select: {
        profile: true,
      },
    });
    this.profile = user.profile;
    return user.profile;
  };
}
