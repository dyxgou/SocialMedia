import { FastifyPluginAsync } from 'fastify'
import { UserRequest } from '../types'

const followUser : FastifyPluginAsync = async(fastify , options) =>
{
  fastify.put<{
    Params : UserRequest
  }>("/:userId" , { onRequest : fastify.auth } , async(request , reply) => 
  {
    const { userId : userIdToFollow } = request.params
    const { userId } = request.user

    const [ userFollowing , userToFollow ] = await fastify.store.User.find({
      _id : [ userId , userIdToFollow ]
    } , { followers : true , followings : true })

    if(!userFollowing || !userToFollow)
      throw fastify.httpErrors.notFound("Some of the two users hasn't found")

    try {
      await userFollowing.updateOne({
        $addToSet : { followings : userIdToFollow }
      })

      await userToFollow.updateOne({
        $addToSet : { followers : userId }
      })

      return reply.status(200).send("The user has been following successfully")
    } catch (error) {
      throw fastify.httpErrors.createError({
        name : "Cannot follow this users",
        message :  error
      })
    }
  })
}

export default followUser