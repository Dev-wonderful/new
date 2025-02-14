import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { PrismaClient, Users } from "@prisma/client";
import log from "../utils/logger";
import { ServerError } from "./error";

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: Request & { user?: Users },
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status_code: "401",
        message: "Invalid token",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status_code: "401",
        message: "Invalid token",
      });
    }

    jwt.verify(token, config.TOKEN_SECRET, async (err, decoded: any) => {
      if (err) {
        return res.status(401).json({
          status_code: "401",
          message: "Invalid token",
        });
      }
      const user = await prisma.users.findFirst({
        where: { id: decoded["userId"] as string },
      });
      if (!user) {
        return res.status(401).json({
          status_code: "401",
          message: "Invalid token",
        });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    log.error(error);
    throw new ServerError("INTERNAL_SERVER_ERROR");
  }
};
