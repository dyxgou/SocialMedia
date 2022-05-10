import { Schema , Document } from "mongoose"

type Image = 
{
  url : string,
  publicId : string
}

export interface IUser extends Document
{
  username : string,
  password : string,
  email : string,
  avatar : Image,
  cover : Image,
  followers : Array<Schema.Types.ObjectId & IUser>,
  followings : Schema.Types.ObjectId[] & IUser[],
} 

const UserSchema = new Schema<IUser>(
  {
    username : {
      type : String,
      required : true,
      trim : true
    },
    email : {
      type : String, 
      required : true, 
      unique : true
    },
    password : {
      type : String,
      required : true
    },
    followers : [
      {
        type : Schema.Types.ObjectId,
        ref : "users"
      }
    ],
    followings : [
      {
        type : Schema.Types.ObjectId,
        ref : "users"
      }
    ],
    avatar : {
      url : String,
      publicId : String
    },
    cover : {
      url : String,
      publicId : String
    },
  }
)

export default UserSchema
