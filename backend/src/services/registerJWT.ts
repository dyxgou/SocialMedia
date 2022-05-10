import fp from "fastify-plugin"
import fastifyJWT from "@fastify/jwt"
import { FastifyPluginAsync } from "fastify"

const registerJWT : FastifyPluginAsync = fp(async (fastify) => 
{
  const SECRET_JWT = process.env.SECRET_JWT

  if(!SECRET_JWT)
  {
    fastify.log.error("JWT secret not found")
    process.exit(1)
  }

  fastify.register(fastifyJWT , {
    secret : SECRET_JWT,
  })

  fastify.log.info("JWT has been installed")
})

export default registerJWT