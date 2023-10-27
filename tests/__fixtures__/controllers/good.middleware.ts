import { NextFunction, Request, Response } from 'express'

export default function good(request: Request, response: Response, next: NextFunction): void {
  const context = request['context'] || []
  context.push({ goodMiddleware: true })
  request['context'] = context
  next()
}
