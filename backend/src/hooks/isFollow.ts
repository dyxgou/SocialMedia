import { IUser } from "../schemas/UserSchema"

const isFollow = (userFollowing : IUser , userToFollow : IUser) => 
{
  const { followings } = userFollowing
  const { followers } = userToFollow

  const includesToFollow = followings.includes(userToFollow._id)
  const includesFollowing = followers.includes(userFollowing._id)

  return includesToFollow && includesFollowing
}


export default isFollow