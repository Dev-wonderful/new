import { signUpSchema, otpSchema, loginSchema } from "../schemas/user";
import { validateData } from "../middleware/validationMiddleware";
import { signUp, verifyOtp, login } from "../controllers";
import { Router } from "express";

const authRoute = Router();

authRoute.post("/register", validateData(signUpSchema), signUp);
authRoute.post("/verify-otp", validateData(otpSchema), verifyOtp);
authRoute.post("/login", validateData(loginSchema), login);

export default authRoute;
