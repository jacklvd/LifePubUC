import { z } from 'zod';

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
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const eventSchema = z.object({
  email: z.string().email('Invalid email format.'),
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().optional(),
  media: z.string().url('Media must be a valid URL').optional(), // Made optional
  mediaType: z.enum(['image', 'video'], { message: 'Invalid media type' }),
  location: z.string().min(3, 'Location must be at least 3 characters long.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  agenda: z.array(
    z.object({
      title: z.string().min(3, 'Agenda title must be at least 3 characters.').optional(),
      startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)').optional(),
      endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)').optional(),
    })
  ).optional(),
});
