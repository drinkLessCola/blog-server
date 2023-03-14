import type { Context } from 'koa'
import type { Logger } from 'log4js'
export type IMiddleware = (
  ctx: Context,
  next: () => Promise<void>
) => Promise<void>


interface IContext extends Context {
  logger: Logger
}
