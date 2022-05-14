import { FastifyPluginAsync } from 'fastify'
//import { CreatePostBody } from './types'

const createPosts : FastifyPluginAsync = async(fastify , options) =>
{
  fastify.post<{
  }>("/" , { onRequest : fastify.auth } , async(request , reply) => 
  {
    const { userId } = request.user

    const user = await fastify.store.User.findById(userId , {
      posts : true
    })

    if(!user)
      throw fastify.httpErrors.notFound("user not found");


    for await (const part of request.parts()) {
      console.log("a");
      
      console.log({ part });      
    }

    return "a"
  }) 
}

export default createPosts