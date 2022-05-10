import { IUser } from "../schemas/UserSchema"

const isFollow = (userFollowing : IUser , userToFollow : IUser) => 
{
  const { followings } = userFollowing
  const { followers } = userToFollow

  console.log({ followings , followers });
  console.log(userToFollow._id);
  
  console.time("Followers")
  
  const includesToFollow = followings.includes(userToFollow._id)
  const includesFollowing = followers.includes(userFollowing._id)

  console.timeEnd("Followers")

  return includesToFollow && includesFollowing
}


export default isFollow