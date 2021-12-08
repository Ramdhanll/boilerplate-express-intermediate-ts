import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import logging from '../../config/logging'
import { IGetUserAuthInfoRequest } from '../../interfaces/IGetUserAuthInfoRequest'

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
   logging.info('Validating jwt token ...')

   const token = req.cookies.token

   if (!token) return res.status(401).json({ message: 'you must be logged in' })

   try {
      jwt.verify(
         token,
         process.env.JWT_SECRET || 'secret',
         (err: any, decoded: any) => {
            if (err) {
               logging.warn('Token invalid, unauthorized ...')
               return res.status(401).json({ message: 'Invalid token', err })
            }

            res.locals.user = decoded
            next()
         }
      )
   } catch (err: any) {
      logging.error(err)
      res.clearCookie('token')
      return res.status(400).send(err.message)
   }
}

export const isAdmin = (
   req: IGetUserAuthInfoRequest,
   res: Response,
   next: NextFunction
) => {
   if (req.user && req.user.isAdmin) {
      next()
   } else {
      res.status(401).json({ message: 'Invalid admin token' })
   }
}
