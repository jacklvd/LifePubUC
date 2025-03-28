import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

export const {
  MONGO_URI,
  JWT_SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  FRONTEND_URL,
  CLOUDINARY_NAME,
  STRIPE_SECRET_KEY,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  REDIS_URL,
} = process.env
