import { z } from "zod";

export const trainerSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(10).max(99),
  region: z.string().min(2),
  email: z.string().email(),
});

export type TrainerFormData = z.infer<typeof trainerSchema>;
