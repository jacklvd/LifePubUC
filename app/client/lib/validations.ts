import { z } from 'zod'

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Invalid email format.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/\d/, 'Password must contain at least one number.'),
  universityId: z.string().regex(/^M\d{8}$/, {
    message: "University ID must start with 'M' followed by 8 digits.",
  }),
})

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
