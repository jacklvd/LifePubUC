import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import cors from 'cors'
import helmet from 'helmet'

import morgan from 'morgan'

import itemRoute from './routes/itemRoute'
import authRoute from './routes/authRoute'
import eventRoute from './routes/eventRoute'
import paymentRoute from './routes/paymentRoute'
import userRoute from './routes/userRoute'
import sellerRoute from './routes/sellerRoute'
import transactionRoute from './routes/transactionRoute'

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
  allowedHeaders: ['Content-Type', 'Authorization'],
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
const apiRouter = express.Router()

// Mount routes to apiRouter
apiRouter.use('/items', itemRoute)
apiRouter.use('/auth', authRoute)
apiRouter.use('/payment', paymentRoute)
apiRouter.use('/user', userRoute)
apiRouter.use('/sellers', sellerRoute)
apiRouter.use('/events', eventRoute)
apiRouter.use('/transactions', transactionRoute)

app.use('/api', apiRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the LifePubUC API' })
})

/* SERVER */
const port = parseInt(process.env.PORT || '8000', 10)
app.listen(port, '0.0.0.0', () => {
  console.log(
    `Server running on port ${port} and accessible at http://localhost:${port}`,
  )
})

if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}
