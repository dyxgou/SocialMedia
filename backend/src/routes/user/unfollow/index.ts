import { FastifyPluginAsync } from 'fastify'
import { UserRequest } from '../types'

const followUser : FastifyPluginAsync = async(fastify , options) =>
{
  fastify.put<{
    Params : UserRequest
  }>("/:userId" , { onRequest : fastify.auth } , async(request , reply) => 
  {
    const { userId } = request.user
    const { userId : userIdToUnfollow } = request.params

    const [ userUnfollowing , userToUnfollow ] = await fastify.store.User.find({
      _id : [ userId , userIdToUnfollow ]
    } , { followers : true , followings : true })

    if(!userUnfollowing || !userToUnfollow)
      throw fastify.httpErrors.notFound("Some of the users hasn't found")

    try {
      await userUnfollowing.updateOne({
        $pull : { followings : userIdToUnfollow }
      })

      await userToUnfollow.updateOne({
        $pull : { followers : userId }
      })
      
      return reply.status(200).send("")
    } catch (error) {
      
    }
  })
}

export default followUser