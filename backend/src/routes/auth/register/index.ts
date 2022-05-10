import { FastifyPluginAsync } from 'fastify'
import { hashPassword } from '../../../hooks/password'
import { RegisterBody } from './types'

const register : FastifyPluginAsync = async(fastify , options) =>
{

  fastify.post<{
    Body : RegisterBody
  }>("/" , async(request , reply) => 
  {
    const { body : userInfo } = request
    const { email , password , username } = userInfo

    if(!email || !password || !username)
      throw fastify.httpErrors.notAcceptable("The data is wrong")

    const hashedPassword = await hashPassword(password)
    userInfo.password =  hashedPassword

    try {
      await fastify.store.User.create(userInfo)

      return reply.status(201).send("User created")
    } catch (error) {
      throw fastify.httpErrors.createError({
        name : "Can't create this user",
        message : error,
      })
    }
  })
}

export default register