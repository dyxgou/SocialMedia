import { FastifyPluginAsync } from 'fastify'
import isFollow from '../../../hooks/isFollow'
import { UserRequest } from '../types'

const followUser : FastifyPluginAsync = async(fastify , options) =>
{
  fastify.put<{
    Params : UserRequest
  }>("/:userId" , { onRequest : fastify.auth } , async(request , reply) => 
  {
    const { userId : userIdToFollow } = request.params
    const { userId } = request.user

    if(userIdToFollow === userId)
      throw fastify.httpErrors.notAcceptable("You can't follow yourself")

    const [ userFollowing , userToFollow ] = await Promise.all([
      fastify.store.User.findById(userId , { followings : true }),
      fastify.store.User.findById(userIdToFollow , { followers : true })
    ])

    if(!userFollowing || !userToFollow)
      throw fastify.httpErrors.notFound("Some of the two users hasn't found")

    const isFollowed = isFollow(userFollowing , userToFollow)

    if(isFollowed)
      throw fastify.httpErrors.notAcceptable("The user is already followed")

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