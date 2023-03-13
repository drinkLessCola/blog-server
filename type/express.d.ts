import { type Request, type Response, type NextFunction } from 'express'

export type ExpressMiddlewareWithRequest<T> = (
  req: Request & T,
  res: Response,
  next: NextFunction
) => Primise<void>

export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Primise<void>
