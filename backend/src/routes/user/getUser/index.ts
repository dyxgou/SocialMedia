import { FastifyPluginAsync } from 'fastify'
import { UserRequest } from '../types'

const getUser : FastifyPluginAsync = async(fastify , options) =>
{
  fastify.get<{
    Params : UserRequest
  }>("/:userId" , async(request , reply) => 
  {
    const { userId } = request.params

    const user = await fastify.store.User.findById(userId , {
      password : false , _id : false , followers : false , following : false 
    })

    if(!user)
      throw fastify.httpErrors.notFound("User not found")

    return user
  })
}

export default getUser