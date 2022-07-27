import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(4).max(36),
});

export const signUpSchema = loginSchema.extend({
  username: z.string().min(3).max(18),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
