import { z } from "zod";

export const TokenSchema = z.object({
  token: z.string(),
});

export type TokenResponse = z.infer<typeof TokenSchema>;

export const UserSchema = z.object({
  id: z.number(),
  full_name: z.string(), 
  city: z.string().nullable().or(z.string()), 
  country: z.string().nullable().or(z.string()),
  bio: z.string().nullable().or(z.string()),
  photo: z.string().nullable().or(z.string()), 
  email: z.string().optional(),
  token: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;