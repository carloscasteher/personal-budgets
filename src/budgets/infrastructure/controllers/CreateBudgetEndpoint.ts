import { validator } from 'hono-openapi/zod'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { factory, type Endpoint } from '../../../shared/infrastructure/controllers/factory.ts'
import { Month } from '../../domain/models/Month.ts'
import { Year } from '../../domain/models/Year.ts'
import { CreateBudget } from '../../use-cases/CreateBudget.ts'

import { describeRoute } from 'hono-openapi'
import { CreateBudgetRequestDTO } from './dtos/CreateBudgetRequestDTO.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'

export const CreateBudgetEndpoint = {
  method: 'post',
  path: '/api/v1/budgets/creation',
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Create a new budget',
      description: 'Creates a new budget for a user',
      tags: [ApiTag.BUDGETS],
      security: [{ bearerAuth: [] }],
      responses: {
        201: {
          description: 'Budget created',
        },
      },
    }),
    validator('json', CreateBudgetRequestDTO),
    async (c) => {
      const createBudget = await c.var.container.getAsync(CreateBudget)

      const body = c.req.valid('json')
      await createBudget.execute({
        userId: UserId.fromPrimitives(body.userId),
        month: Month.fromPrimitives(body.month),
        year: Year.fromPrimitives(body.year),
      })
      return c.body(null, 201)
    }
  ),
} satisfies Endpoint
