import { Type , Static } from '@sinclair/typebox'

const userRequest = Type.Object(
  {
    userId : Type.String()
  }
)

export type UserRequest = Static<typeof userRequest>