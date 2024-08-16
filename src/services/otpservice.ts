import prisma from "../models";
import { Tokens, Users } from "@prisma/client";
import { generateNumericOTP } from "../utils";
import { Expired, ResourceNotFound } from "../middleware";
// import { Prisma } from "@prisma/client";
// import prisma from "../models";

export class OtpService {
  async createOtp(user_id: string) {
    try {
      const user = await prisma.users.findFirst({
        where: { id: user_id },
      });
      if (!user) {
        throw new ResourceNotFound("User not found");
      }

      const token = generateNumericOTP(6);
      const otp_expires = new Date(Date.now() + 15 * 60 * 1000);

      const otp = await prisma.tokens.create({
        data: {
          token,
          expiringAt: otp_expires,
          user: { connect: { id: user_id } },
        },
      });

      return otp.token;
    } catch (error) {
      return;
    }
  }

  async verifyOtp(user_id: string, token: string): Promise<boolean> {
    try {
      const otp = await prisma.tokens.findFirst({
        where: { token, user: { id: user_id } },
      });

      if (!otp) {
        throw new ResourceNotFound("Invalid OTP");
      }

      if (otp.expiringAt < new Date()) {
        throw new Expired("OTP has expired");
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
