import UserModel from '../models/user'
import type { IUserAttributes, IUserCreationAttributes, IUserModel } from '../models/user'

export const createUser = async (user: IUserCreationAttributes): Promise<IUserAttributes['userId']> => {
  const { userId } = await UserModel.create(user)
  return userId
}

export const listUser = async (): Promise<IUserModel[]> => {
  const data = await UserModel.findAll({
    where: {
      'isDelete': false
    },
    attributes: ['userId', 'userName', 'email']
  })
  return data
}
