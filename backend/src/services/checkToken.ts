import { FastifyLoggerInstance, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { RouteGenericInterface } from "fastify/types/route"
import { IncomingMessage, Server } from "http"
import { FastifyPluginAsync } from "fastify"


const checkToken : FastifyPluginAsync = fp(async(fastify) =>
{
  fastify.decorate("auth" , async(req  : Request) => 
  {
    try {
      await req.jwtVerify()
    } catch (error) {
      fastify.log.error({ error })
      
      throw fastify.httpErrors.unauthorized("Invalid token")
    }
  })
})

export interface IPaylaod { userId : string }
export interface ITokenUser { userId : string , iat : number , exp : number }
export type IVerifyToken  = (req : Request) => void

export default checkToken

type Request =  FastifyRequest<RouteGenericInterface, Server, IncomingMessage, unknown, FastifyLoggerInstance>