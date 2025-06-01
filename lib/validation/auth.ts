import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
