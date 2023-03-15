import type { IUserCreationAttributes } from '../models/user'
import bcrypt from 'bcrypt'
import { checkMissingParams } from '../utils'
import type { Next } from 'koa'
import type { IContext } from '../type/middleware'
import { createUser, listUser } from '../dao/user'

const salt = bcrypt.genSaltSync(10)

interface IUser {
  userName: string
  password: string
  email: string
}

class UserController {

  async create (ctx: IContext, next: Next): Promise<void> {
    ctx.logger.debug(`createUser body=${JSON.stringify(ctx.body)}`)

    const { userName, password, email } = ctx.body as IUser
    const missingParams = checkMissingParams(userName, password, email)

    if (missingParams) {
      ctx.logger.debug('[error] missingParams')
      ctx.status = 422
      ctx.body = {
        code: 422,
        msg: '参数错误'
      }
      return
    }

    const newUser: IUserCreationAttributes = {
      userName,
      password: bcrypt.hashSync(password, salt),
      email
    }

    const userId = await createUser(newUser)
    ctx.body = {
      code: 200,
      data: {
        userId
      },
      msg: '创建成功'
    }
    ctx.logger.debug(`[success] ${userId}`)
  }

  async list (ctx: IContext, next: Next): Promise<void> {
    ctx.logger.debug('listUser')

    const data = await listUser()
    ctx.body = {
      code: 200,
      msg: 'success',
      data
    }
    ctx.logger.debug(`[success] ${JSON.stringify(data)}`)
  }
}

export default new UserController()
