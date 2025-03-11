import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

export const { MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS, FRONTEND_URL, CLOUDINARY_NAME } =
  process.env
