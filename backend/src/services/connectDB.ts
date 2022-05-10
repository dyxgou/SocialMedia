import fp from "fastify-plugin";
import * as mongoose from "mongoose"
import UserSchema, { IUser } from "../schemas/UserSchema";
import { FastifyPluginAsync } from "fastify";

const connectDB : FastifyPluginAsync = fp(async (fastify) => 
{
  const URI = process.env.MONGO_URI

  if(!URI)
  {
    fastify.log.error("Mongo URI not found")
    process.exit(1)
  }

  await mongoose.connect(URI).then(connection => {
    fastify.decorate("store" , {
      User : connection.model("users" , UserSchema),
      db : connection
    })
    
    fastify.log.info("Mongoose connected")
  }).catch((err) => {
    fastify.log.error({ err })

    process.exit(1)
  })

  process.on("uncaughtException" ,(err => {
    fastify.log.error(err)

    mongoose.disconnect()
  }))
})

export interface IStore
{
  User : mongoose.Model<IUser>
  db : typeof mongoose
}

export default connectDB
