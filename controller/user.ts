import UserModel, { type IUserCreationAttributes } from '../models/user'
import type { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import type { ExpressMiddlewareWithRequest, ExpressMiddleware } from '../type/express'
import { checkMissingParams } from '../utils'

const salt = bcrypt.genSaltSync(10)

interface IUser {
  userName?: string
  password?: string
  email?: string
}

export const createUser: ExpressMiddlewareWithRequest<IUser> = async (req, res) => {
  const { userName, password, email } = req.body ?? {}
  const missingParams = checkMissingParams(userName, password, email)

  if (missingParams) {
    res.send({
      code: 422,
      msg: '参数错误'
    })
    return
  }

  const newUser: IUserCreationAttributes = {
    userName,
    password: bcrypt.hashSync(password, salt),
    email
  }

  try {
    const result = await UserModel.create(newUser)
    const { userId } = result
    res.send({
      code: 200,
      data: {
        userId
      },
      msg: '创建成功'
    })
  } catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '服务端错误'
    })
  }
}

export const getUserList: ExpressMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const data = await UserModel.findAll({
    where: {
      'isDelete': false
    },
    attributes: ['userId', 'userName', 'email']
  })
  res.send({
    code: 200,
    msg: 'success',
    data
  })
}

export default {
  create: createUser,
  list: getUserList
}
