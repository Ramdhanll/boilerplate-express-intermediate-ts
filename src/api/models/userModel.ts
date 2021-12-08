import mongoose, { Schema, Document } from 'mongoose'

interface IUserModel extends Document {
   _id?: string | object // type object for query search in controller
   name?: string | object // type object for query search in controller
   photo: string
   email: string
   password: string
   isAdmin: boolean
   gender: string
}

const UserSchema = new Schema<IUserModel>(
   {
      name: {
         type: String,
         required: true,
      },
      photo: {
         type: String,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      isAdmin: {
         type: Boolean,
         required: true,
         default: false,
      },
   },
   {
      timestamps: true,
   }
)

const Users = mongoose.model<IUserModel>('Users', UserSchema)

export default Users
