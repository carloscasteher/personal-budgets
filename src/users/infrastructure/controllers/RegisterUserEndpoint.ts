import { validator } from 'hono-openapi/zod'
import { factory, type Endpoint } from '../../../shared/infrastructure/controllers/factory.ts'

import { describeRoute } from 'hono-openapi'
import { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'
import { PlainPassword } from '../../../shared/domain/models/PlainPassword.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { RegisterUser } from '../../use-cases/RegisterUser.ts'
import { RegisterUserRequestDTO } from './dtos/RegisterUserRequestDTO.ts'

export const RegisterUserEndpoint = {
  method: 'post',
  path: '/api/v1/users/registration',
  secured: false,
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Register a new user',
      description: 'Registers a new user',
      tags: [ApiTag.USERS],
      security: [{ bearerAuth: [] }],
      responses: {
        201: {
          description: 'User registered',
        },
      },
    }),
    validator('json', RegisterUserRequestDTO),
    async (c) => {
      const registerUser = await c.var.container.getAsync(RegisterUser)

      const body = c.req.valid('json')
      await registerUser.execute({
        name: body.name,
        lastName: body.lastName,
        email: EmailAddress.fromPrimitives(body.email),
        password: PlainPassword.fromPrimitives(body.password),
      })
      return c.body(null, 201)
    }
  ),
} satisfies Endpoint
