import type { Endpoint } from './factory.ts'
import { Hono } from 'hono'
import { Token } from '../../domain/services/Token.ts'
import { config } from '../config.ts'
import { containerMiddleware } from './middlewares/ContainerMiddleware.ts'
import { handle } from './middlewares/ErrorHandler.ts'
import type { interfaces } from 'inversify'
import { jwt } from 'hono/jwt'
import { loggerMiddleware } from './middlewares/LoggerMiddleware.ts'
import { requestContextMiddleware } from './middlewares/RequestContext.ts'

declare module 'hono' {
  interface ContextVariableMap {
    container: interfaces.Container
  }
}

export function createHono({ container }: interfaces.Context) {
  const app = new Hono()
  app.use(containerMiddleware(container))
  app.use(requestContextMiddleware)
  app.use(loggerMiddleware(container.get(Token.LOGGER)))
  for (const endpoint of container.getAll<Endpoint>(Token.ENDPOINT)) {
    const shouldBeSecured = endpoint.secured ?? true
    const handlers = [
      ...(shouldBeSecured ? [jwt({ secret: config.jwt.secret })] : []),
      ...endpoint.handlers,
    ]
    app[endpoint.method](endpoint.path, ...handlers)
  }
  app.onError(handle)

  return app
}
