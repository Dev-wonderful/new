import jwt from "jsonwebtoken";
import config from "../config";
import {
  BadRequest,
  Conflict,
  HttpError,
  ResourceNotFound,
} from "../middleware";
import { Users, Profiles, Tokens, PrismaClient, Prisma } from "@prisma/client";
import prisma, { UsersModel, UserStatus } from "../models";
import { IAuthService, IUserLogin, IUserSignUp, UserRoles } from "../types";
import {
  comparePassword,
  generateAccessToken,
  generateNumericOTP,
  generateToken,
  hashPassword,
  verifyToken,
} from "../utils";
import { OtpService } from ".";

export class AuthService implements IAuthService {
  private usersRepository: Prisma.UsersDelegate;
  private profilesRepository: Prisma.ProfilesDelegate;
  private otpService: OtpService;

  constructor() {
    this.usersRepository = UsersModel.Query();
    this.profilesRepository = prisma.profiles;
    this.otpService = new OtpService();
  }

  public async signUp(payload: IUserSignUp) {
    const {
      first_name,
      last_name,
      middle_name,
      phone_number,
      email,
      password,
      estate,
      avatarUrl,
      address,
    } = payload;

    try {
      const userExists = await this.usersRepository.findFirst({
        where: { email },
      });

      if (userExists) {
        throw new Conflict("User already exists");
      }

      const hashedPassword = await hashPassword(password);
      const newUser = {
        name: `${first_name} ${last_name}`,
        email,
        password: hashedPassword,
        status: UserStatus.INACTIVE,
        role: UserRoles.USER,
        estate,
      };
      const user = new UsersModel(newUser);
      await user.save();

      const profile = {
        firstName: first_name,
        lastName: last_name,
        middleName: middle_name || "",
        avatar: avatarUrl,
        phoneNumber: phone_number,
        address,
        userId: user.id,
      };
      await user.addProfile(profile);

      const access_token = await generateAccessToken(user.id);

      const otp = await this.otpService.createOtp(user.id);
      console.log("OTP: ", otp);

      // await Sendmail({
      //   from: `Boilerplate <support@boilerplate.com>`,
      //   to: email,
      //   subject: "OTP VERIFICATION",
      //   html: compilerOtp(parseInt(otp.token), user.first_name),
      // });

      const userResponse = {
        id: user.id,
        first_name: user.profile.firstName,
        last_name: user.profile.lastName,
        email: user.email,
        role: user.role,
        avatar_url: user.profile.avatar,
      };

      return {
        user: userResponse,
        access_token,
        message:
          "User Created Successfully. Kindly check your mail for your verification token",
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async verifyEmail(token: string, email: string) {
    try {
      console.log("Email: ", email);
      const user = await this.usersRepository.findFirst({
        where: { email, token: { token } },
      });

      console.log("User: ", user);

      if (!user) {
        throw new ResourceNotFound("User not found");
      }
      // const otp = await this.otpService.verifyOtp(user.id, token);
      // if (!otp) {
      //   throw new BadRequest("Invalid OTP");
      // }

      // if (!user) {
      //   throw new ResourceNotFound("User not found");
      // }
      await this.usersRepository.update({
        where: { id: user.id },
        data: { status: UserStatus.ACTIVE },
      });

      const access_token = await generateAccessToken(user.id);

      return {
        access_token,
        message: "Email verified successfully",
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }

  public async login(payload: IUserLogin) {
    const { email, password } = payload;

    try {
      const user = await UsersModel.Query().findFirst({
        where: { email },
        include: { profile: true },
      });

      if (!user) {
        throw new ResourceNotFound("User not found");
      }

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequest("Invalid email or password");
      }

      const access_token = await generateAccessToken(user.id);

      const userResponse = {
        id: user.id,
        first_name: user.profile.firstName,
        last_name: user.profile.lastName,
        email: user.email,
        role: user.role,
        avatar_url: user.profile.avatar,
      };

      return {
        user: userResponse,
        access_token,
        message: "Login successful",
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError(error.status || 500, error.message || error);
    }
  }
}
