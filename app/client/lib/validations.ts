import { z } from 'zod'
import { parse, isBefore, isEqual, isSameDay } from 'date-fns'

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

const agendaItemSchema = z
  .object({
    id: z.string(),
    title: z.string().min(3, 'Agenda title must be at least 3 characters.'),
    description: z.string().optional(),
    host: z.string().optional(),
    startTime: z
      .string()
      .regex(
        /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
        'Invalid start time format (HH:mm AM/PM)',
      ),
    endTime: z
      .string()
      .regex(
        /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
        'Invalid end time format (HH:mm AM/PM)',
      ),
  })
  .refine(
    (data) => {
      const start = parse(data.startTime, 'hh:mm a', new Date())
      const end = parse(data.endTime, 'hh:mm a', new Date())
      return isBefore(start, end)
    },
    {
      path: ['startTime'],
      message: 'Start time must be before end time.',
    },
  )

const agendaSchema = z.object({
  id: z.string(),
  title: z.string().min(3, 'Agenda title must be at least 3 characters.'),
  items: z
    .array(agendaItemSchema)
    .min(1, 'Agenda must contain at least one item'),
})

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z
    .string()
    .min(1, 'Answer is required')
    .max(400, 'Answer is too long'),
})

const highlightsSchema = z.object({
  ageRestriction: z.enum(['all', 'restricted', 'guardian']).optional(),
  doorTime: z.string().optional(),
  parkingInfo: z.enum(['free', 'paid', 'none']).optional(),
})

export const eventSchema = z
  .object({
    email: z.string(),
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters long.')
      .max(50, 'Title must be at most 50 characters long.'),
    summary: z
      .string()
      .min(3, 'Summary must be at least 3 characters long.')
      .max(200, 'Summary must be at most 200 characters long.'),
    description: z
      .string()
      .max(500, 'Description must be at most 500 characters long.')
      .optional(),
    media: z.string().url('Media must be a valid URL').optional(),
    mediaType: z.enum(['image', 'video'], { message: 'Invalid media type' }),
    location: z.string().min(3, 'Location is required.'),
    date: z.string().min(1, 'Date is required'),
    startTime: z
      .string()
      .regex(
        /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
        'Invalid time format (HH:mm AM/PM)',
      ),
    endTime: z
      .string()
      .regex(
        /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
        'Invalid time format (HH:mm AM/PM)',
      ),
    agenda: z.array(agendaSchema).optional().default([]),
    highlights: highlightsSchema.optional().default({}),
    faqs: z.array(faqSchema).optional().default([]),
  })
  // Ensure startTime < endTime within the same day
  .refine(
    (data) => {
      const start = parse(data.startTime, 'hh:mm a', new Date(data.date))
      const end = parse(data.endTime, 'hh:mm a', new Date(data.date))

      return isBefore(start, end)
    },
    {
      path: ['startTime'], // explicitly shows error on startTime
      message: 'Start time must be before end time.',
    },
  )
  .refine(
    (data) => {
      const start = parse(data.startTime, 'hh:mm a', new Date(data.date))
      const end = parse(data.endTime, 'hh:mm a', new Date(data.date))

      return !isEqual(start, end)
    },
    {
      path: ['endTime'], // explicitly shows error on endTime
      message: 'End time cannot be equal to start time.',
    },
  )
  // Explicitly ensure times are on the same day (extra safety)
  .refine(
    (data) => {
      const date = new Date(data.date)
      const timeFormat = 'hh:mm a'
      const start = parse(data.startTime, timeFormat, date)
      const end = parse(data.endTime, timeFormat, date)

      return isSameDay(start, end)
    },
    {
      path: ['endTime'],
      message: 'Start and end times must be within the same day.',
    },
  )
