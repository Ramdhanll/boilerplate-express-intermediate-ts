import config from './config/config'
import logging from './config/logging'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import createServer from './api/helpers/server'

dotenv.config()

const app = createServer()

// Connect to Mongo
mongoose
   .connect(config.mongo.url, config.mongo.options)
   .then(() => {
      logging.info('Mongo connected.')
   })
   .catch((e) => {
      logging.error(e)
   })

// Listen for request
app.listen(config.server.port, () => {
   logging.info(`Server is running at ${config.server.port} ...`)
})
