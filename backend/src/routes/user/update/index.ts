import { FastifyPluginAsync } from 'fastify'
import { hashPassword } from '../../../hooks/password'
import { UpdateBody } from './types'

const updateUser : FastifyPluginAsync = async(fastify , options) =>
{
  fastify.post<{
    Body : UpdateBody
  }>("/" , { onRequest : fastify.auth } , async(request , reply) => 
  {
    const { userId }  = request.user
    const { body : userInfo } = request
    
    const user = await fastify.store.User.findById(userId)

    if(!user)
      throw fastify.httpErrors.notFound("User to update not found")
    
    if(userInfo?.password)
    {
      const newPassword = await hashPassword(userInfo?.password)

      userInfo.password = newPassword
    }

    try {
      await user?.updateOne({
        $set : userInfo
      })

      return reply.status(200).send("user updated")
    } catch (error) {
      throw fastify.httpErrors.createError({
        name : "Can't update this user",
        message : error,
      })
    }
  })
}

export default updateUser