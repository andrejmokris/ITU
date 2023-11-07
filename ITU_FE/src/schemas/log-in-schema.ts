import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(50),
});

export const tokenSchema = z.object({
  token: z.string().min(1),
});
