import { Request, Response } from 'express'
import logging from '../../config/logging'
import Users from '../models/userModel'

export const getUsers = async (req: Request, res: Response) => {
   logging.info(`Incoming read all`)

   const pageSize = 10
   const page = Number(req.query.page) || 1
   const name = req.query.name || ''
   const _id = req.query.id || ''

   const _idFilter = _id ? { _id } : {}
   const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {}

   try {
      const count = await Users.countDocuments({
         ..._idFilter,
         ...nameFilter,
      })

      const users = await Users.find({
         ..._idFilter,
         ...nameFilter,
      })
         .select('-password')
         .skip(pageSize * (page - 1))
         .limit(pageSize)

      res.status(200).json({
         users,
         page,
         pages: Math.ceil(count / pageSize),
      })
   } catch (error) {
      res.status(500).json({ message: 'Server down!', error })
   }
}
