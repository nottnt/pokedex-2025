import { z } from "zod";

const passwordProperty = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordProperty,
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Set the error on the confirmPassword field
  });
export type SignUpInput = z.infer<typeof signUpSchema>;

export const requestVerificationEmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export type RequestVerificationEmailInput = z.infer<
  typeof requestVerificationEmailSchema
>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset password schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordProperty,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => {
    console.log('resetPasswordSchema data', data);
    return data.password === data.confirmPassword
  }, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
