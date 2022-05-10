import { Type , Static } from '@sinclair/typebox'

const updateBody = Type.Object({
  password : Type.Optional(Type.String())
} , { minProperties : 1 }) 

export type UpdateBody = Static<typeof updateBody>