import { z } from "zod";

const signUpSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().min(1).optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  address: z.string().min(1, "Address is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  estate: z.string().min(1, "Estate is required"),
  avatarUrl: z.string().min(1, "Avatar is required"),
});

const otpSchema = z.object({
  token: z
    .string()
    .min(1, "Token is required")
    .min(6, "Token must be at least 6 characters long"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export { signUpSchema, otpSchema, loginSchema };
