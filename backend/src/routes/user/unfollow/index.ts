import { FastifyPluginAsync } from 'fastify'
import isFollow from '../../../hooks/isFollow'
import { UserRequest } from '../types'

const followUser : FastifyPluginAsync = async(fastify , options) =>
{
  fastify.put<{
    Params : UserRequest
  }>("/:userId" , { onRequest : fastify.auth } , async(request , reply) => 
  {
    const { userId } = request.user
    const { userId : userIdToUnfollow } = request.params

    const [ userToUnfollow , userUnfollowing ] = await fastify.store.User.find({
      _id : [ userId , userIdToUnfollow ]
    } , { followers : true , followings : true })

    if(!userUnfollowing || !userToUnfollow)
      throw fastify.httpErrors.notFound("Some of the users hasn't found")

    const isFollowed =  isFollow(userUnfollowing , userToUnfollow) 

    if(!isFollowed)
      throw fastify.httpErrors.notAcceptable("You can't unfollow to someone that you've never followed before")

    try {
      await userUnfollowing.updateOne({
        $pullAll : { followings : [userIdToUnfollow] }
      })

      await userToUnfollow.updateOne({
        $pullAll : { followers : [userId] }
      })
      
      return reply.status(200).send("The user has been unfollowed succesfully")
    } catch (error) {
      throw fastify.httpErrors.createError({
        name : "Cannot unfollow this users",
        message :  error
      })
    }
  })
}

export default followUser