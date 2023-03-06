import UserModel, { IUserCreationAttributes } from '../models/user'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'

const salt = bcrypt.genSaltSync(10)

type ExpressMiddleware<T> =  (
  req: Request & T, 
  res: Response, 
  next: NextFunction
) => void

interface IUser {
  userName?: string,
  password?: string,
  email?: string
}

function checkMissingParams(...params: any[]) {
  const res = params.reduce((sum, param) => {
    console.log(param, !!param)
    return sum + !!param
  }, 0)
  return res !== params.length
}

export const createUser: ExpressMiddleware<IUser> = async (req, res, next) => {
  const { userName, password, email } = req?.body
  const missingParams = checkMissingParams(userName, password, email)

  if(missingParams) {
    res.send({
      code: 422,
      msg: '参数错误'
    })
    return
  } 

  const newUser = {
    userName,
    password: bcrypt.hashSync(password, salt),
    email,
  } as IUserCreationAttributes
  
  try {
    const result = await UserModel.create(newUser)
    const { userId } = result
    if(result) {
      res.send({ 
        code: 200, 
        data: {
          userId,
        },
        msg: '创建成功' 
      })
    } else {
      throw new Error('Unknown Error')
    }
  } catch(err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '服务端错误'
    })
  }
}

export const getUserList = async (req: Request, res: Response, next: NextFunction) => {
  const data = await UserModel.findAll()

      
}

export default {
  create: createUser,
  list: getUserList,
}