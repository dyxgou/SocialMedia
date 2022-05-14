import { Schema, Document } from "mongoose"
import { IUser } from "./UserSchema"

export interface IPost extends Document
{
  userId : Schema.Types.ObjectId & IUser,
  description : string,
  image ?: {
    url : string,
    publicId : string
  },
  comments ?: Array<Schema.Types.ObjectId & IPost>,
  likes : Schema.Types.ObjectId[] & IUser[],
  loves : Schema.Types.ObjectId[] & IUser[],
}

const PostSchema = new Schema<IPost>(
  {
    userId : {
      type : Schema.Types.ObjectId,
      required : true,
      ref : "users"
    },
    description : {
      Type : String,
      trim : true,
    },
    image : {
      url : String,
      publicId : String
    },
    comments : [
      {
        type : Schema.Types.ObjectId,
        ref : "comments"
      }
    ],
    likes : [
      {
        type : Schema.Types.ObjectId,
        ref : "users"
      }
    ],
    loves : [
      {
        type : Schema.Types.ObjectId,
        ref : "users"
      }
    ],
  }
)

export default PostSchema