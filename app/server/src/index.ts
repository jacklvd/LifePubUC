import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import cors from 'cors'
import helmet from 'helmet'

import morgan from 'morgan'

import itemRoute from './routes/itemRoute'
import authRoute from './routes/authRoute'
import paymentRoute from './routes/paymentRoute'
import userRoute from './routes/userRoute'
import sellerRoute from './routes/sellerRoute'

/* CONFIGURATIONS */
dotenv.config()

const isProduction = process.env.NODE_ENV === 'production'

const app = express()
//middleware

app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'application/json'],
  credentials: true,
}

app.use(cors(corsOptions))

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI || '')
    .then((result) => {
      console.log('connected to Mongodb')
    })
    .catch((err) => {
      console.error(err)
    })
}

/* ROUTES */
/* ROUTES */
const apiRouter = express.Router()

// Mount routes to apiRouter
apiRouter.use('/items', itemRoute)
apiRouter.use('/auth', authRoute)
apiRouter.use('/payment', paymentRoute)
apiRouter.use('/user', userRoute)
apiRouter.use('/sellers', sellerRoute)

app.use('/api', apiRouter)

/* SERVER */
const port = process.env.PORT || 8000

if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}
