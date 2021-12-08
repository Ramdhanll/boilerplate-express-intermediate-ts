import { Request, Response } from 'express'
import { usersDummy } from '../../dummies'
import Users from '../models/userModel'
import { validationResult } from 'express-validator'
import { generateToken } from '../helpers/jwt'
import bcrypt from 'bcrypt'
import logging from '../../config/logging'
import { IGetUserAuthInfoRequest } from '../../interfaces/IGetUserAuthInfoRequest'

export const seed = async (req: Request, res: Response) => {
   logging.info('Incoming seed users')
   await Users.deleteMany({})

   const createdUsers = await Users.insertMany(usersDummy)

   logging.info('Users created')
   res.send(createdUsers)
}

export const login = async (req: Request, res: Response) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const { email, password } = req.body

   try {
      const user = await Users.findOne({ email })
      if (user) {
         const token = generateToken({
            _id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            gender: user.gender,
         })
         if (bcrypt.compareSync(password, user.password)) {
            return res
               .status(200)
               .cookie('token', token, { httpOnly: true })
               .json({
                  user: {
                     _id: user._id,
                     name: user.name,
                     email: user.email,
                     photo: user.photo,
                     gender: user.gender,
                     token,
                  },
               })
         }
         throw 'Email atau password salah'
      } else {
         throw 'Email belum terdaftar'
      }
   } catch (error: any) {
      logging.error(error)
      res.status(500).json({
         status: 'error',
         errors: [{ msg: error?.name === 'CastError' ? error.message : error }],
         message: error,
      })
   }
}

export const register = async (req: Request, res: Response) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const { name, email, password } = req.body

   const user = new Users({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
   })

   const createdUser = await user.save()
   res.status(200).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      photo: createdUser.photo,
      gender: createdUser.gender,
      token: generateToken(createdUser),
   })
}

export const logout = async (req: Request, res: Response) => {
   res.clearCookie('token')
   res.send({ success: true })
}

export const status = async (req: IGetUserAuthInfoRequest, res: Response) => {
   res.status(200).json({
      status: 'success',
      user: {
         _id: req.user._id,
         name: req.user.name,
         email: req.user.email,
         photo: req.user.photo,
         gender: req.user.gender,
      },
      message: 'status login',
   })
}

/**
 * Upload image from client to cloudinary
 * 
 * import cloudinary from '../helpers/cloudinary.js'
   import streamifier from 'streamifier'
   
 *   if (req.file) {
         streamifier.createReadStream(req.file.buffer).pipe(
            cloudinary.uploader.upload_stream(
               {
                  folder: 'Hilman App',
               },
               async function (error, result) {
                  if (error)
                     return res
                        .status(404)
                        .json({ message: 'error upload photo' })
                  user.photo = result.url

                  const updatedUser = await user.save()
                  res.status(200).json({
                     message: 'User updated successfully!',
                     data: { user: updatedUser },
                  })
               }
            )
         )
      } 
 */
