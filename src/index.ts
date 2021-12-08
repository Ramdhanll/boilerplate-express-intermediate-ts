import express from 'express'
import config from './config/config'
import logging from './config/logging'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { authRouter, userRouter } from './api/routes/'

const app = express()

// Middleware
app.use(
   cors({
      credentials: true,
      origin: ['*', 'http://localhost:3000', 'http://localhost'],
   })
)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Connect to Mongo
mongoose
   .connect(config.mongo.url, config.mongo.options)
   .then(() => {
      logging.info('Mongo connected.')
   })
   .catch((e) => {
      logging.error(e)
   })

// logging middleware
app.use((req, res, next) => {
   logging.info(
      `METHOD: '${req.method}' URL: '${req.url}' - IP: '${req.socket.remoteAddress}'`
   )

   res.on('finish', () => {
      logging.info(
         `METHOD: '${req.method}' URL: '${req.url}' - IP: '${req.socket.remoteAddress}' - STATUS: '${req.statusCode}' `
      )
   })

   next()
})

// API Access Policies
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*')
   res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
   )

   if (req.method === 'OPTIONS') {
      res.header(
         'Access-Control-Allow-Methods',
         'PUT, POST, PATCH, DELETE, GET'
      )
      return res.status(200).json({})
   }

   next()
})

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)

// Error Handling
app.use((req, res, next) => {
   const error = new Error('not found')

   return res.status(404).json({
      message: error.message,
   })
})

// Listen for request

app.listen(config.server.port, () => {
   logging.info(`Server is running at ${config.server.port} ...`)
})
