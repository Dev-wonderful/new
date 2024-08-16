import { Request, Response, NextFunction } from "express";
import { UserRoles } from "../types";
import jwt from "jsonwebtoken";
import { Users } from "@prisma/client";
import prisma from "../models";

export const checkPermissions = (roles: UserRoles[]) => {
  return async (
    req: Request & { user?: Users },
    res: Response,
    next: NextFunction,
  ) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    try {
      const decodedToken = jwt.decode(token);
      if (typeof decodedToken === "string" || !decodedToken) {
        return res
          .status(401)
          .json({ status: "error", message: "Access denied. Invalid token" });
      }
      const userRepository = prisma.users;
      const user = await userRepository.findFirst({
        where: { id: decodedToken.userId },
      });

      if (!user || !roles.includes(user.role as UserRoles)) {
        return res
          .status(403)
          .json({ status: "error", message: "Access denied. Not an admin" });
      }
      next();
    } catch (error) {
      res
        .status(401)
        .json({ status: "error", message: "Access denied. Invalid token" });
    }
  };
};
