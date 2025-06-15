import { DEFAULT_REQUIRED_ERROR_MESSAGE } from "@/constants";
import { z } from "zod";

export const trainerSchema = z.object({
  name: z.string().min(1, DEFAULT_REQUIRED_ERROR_MESSAGE),
  age: z.string().min(1, DEFAULT_REQUIRED_ERROR_MESSAGE),
  region: z.string().min(1, DEFAULT_REQUIRED_ERROR_MESSAGE),
  email: z
    .string()
    .min(1, DEFAULT_REQUIRED_ERROR_MESSAGE)
    .email(
      "Invalid email format. Please use a valid email address (e.g., example@domain.com)"
    ),
});

export type TrainerFormData = z.infer<typeof trainerSchema>;
