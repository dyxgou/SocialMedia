import { Type , Static } from '@sinclair/typebox'

const createPostBody = Type.Object(
  {
    description : Type.Optional(Type.String()),
    
  }
)

export type CreatePostBody = Static<typeof createPostBody>