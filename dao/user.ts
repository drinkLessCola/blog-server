import UserModel, { type IUserCreationAttributes } from '../models/user'

export const createUser = async (user: IUserCreationAttributes) => {
  const { userId } = await UserModel.create(user)
  return userId
}

export const listUser = async () => {
  const data = await UserModel.findAll({
    where: {
      'isDelete': false
    },
    attributes: ['userId', 'userName', 'email']
  })
  
  return data
}