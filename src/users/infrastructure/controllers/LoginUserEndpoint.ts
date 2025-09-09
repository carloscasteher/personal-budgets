import { resolver, validator } from 'hono-openapi/zod'
import { factory, type Endpoint } from '../../../shared/infrastructure/controllers/factory.ts'

import { describeRoute } from 'hono-openapi'
import { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'
import { PlainPassword } from '../../../shared/domain/models/PlainPassword.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { LoginUser } from '../../use-cases/LoginUser.ts'
import { LoginUserRequestDTO } from './dtos/LoginUserRequestDTO.ts'
import { LoginUserResponseDTO } from './dtos/LoginUserResponseDTO.ts'

export const LoginUserEndpoint = {
  method: 'post',
  path: '/api/v1/users/login',
  secured: false,
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Login a user',
      description: 'Logs in a user',
      tags: [ApiTag.USERS],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'User logged in',
          content: {
            'application/json': {
              schema: resolver(LoginUserResponseDTO),
            },
          },
        },
      },
    }),
    validator('json', LoginUserRequestDTO),
    async (c) => {
      const loginUser = await c.var.container.getAsync(LoginUser)
      const body = c.req.valid('json')

      const accessToken = await loginUser.execute({
        email: EmailAddress.fromPrimitives(body.email),
        password: PlainPassword.fromPrimitives(body.password),
      })
      return c.json({ accessToken }, 200)
    }
  ),
} satisfies Endpoint
