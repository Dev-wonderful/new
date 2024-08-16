import { PrismaClient } from "@prisma/client";
import UsersModel, { UserStatus } from "./users.model";

const prisma = new PrismaClient();
UsersModel.prisma = prisma;

export default prisma;
export { UsersModel, UserStatus };
