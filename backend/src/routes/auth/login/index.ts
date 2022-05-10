import { FastifyPluginAsync } from 'fastify'
import { comparePassword } from '../../../hooks/password'
import { LoginBody } from './types'

const login : FastifyPluginAsync = async(fastify , options) =>
{
  fastify.post<{
    Body : LoginBody
  }>("/" ,  async(request , reply) => 
  {
    const { email , password } = request.body

    if(!email || !password)
      throw fastify.httpErrors.badRequest("Email or password not found")

    const user = await fastify.store.User.findOne({ email })

    const isCorrectPassword = await comparePassword(password , user?.password)

    if(!isCorrectPassword || !user)
      throw fastify.httpErrors.unauthorized("The email or the password is wrong")

    const SEVEN_DAYS = 60 * 60 * 24 *7

    const token = fastify.jwt.sign({ userId : user?._id } , {
      expiresIn : SEVEN_DAYS
    })

    return reply.status(200).send({ token })
  })
}

export default login