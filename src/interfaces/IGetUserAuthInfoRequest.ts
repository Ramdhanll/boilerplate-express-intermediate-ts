import { Request } from 'express'

export interface IGetUserAuthInfoRequest extends Request {
   user: {
      _id?: string
      isAdmin?: boolean
      name?: string
      photo?: string
      email?: string
      password?: string
      gender?: string
   }
}
