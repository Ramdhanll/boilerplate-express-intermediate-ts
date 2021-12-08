import bcrypt from 'bcrypt'
import IUser from '../interfaces/IUser'

const salt = bcrypt.genSaltSync(8)

export const usersDummy: IUser[] = [
   {
      name: 'admin',
      password: bcrypt.hashSync('password', salt),
      isAdmin: true,
      email: 'admin@gmail.com',
      gender: 'L',
   },
]
