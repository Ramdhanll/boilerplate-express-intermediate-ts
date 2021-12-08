import express from 'express'
import { getUsers } from '../controller/userController'

const router = express.Router()

router.get('/', getUsers)

export default router
