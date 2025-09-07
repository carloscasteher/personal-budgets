
import { validator } from 'hono-openapi/zod'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { factory, type Endpoint } from '../../../shared/infrastructure/controllers/factory.ts'
import { Month } from '../../domain/models/Month.ts'
import { Year } from '../../domain/models/Year.ts'
import { CreateBudget } from '../../use-cases/CreateBudget.ts'

import { describeRoute } from 'hono-openapi'
import { CreateBudgetRequestDTO } from './dtos/CreateBudgetRequestDTO.ts'

export const CreateBudgetEndpoint = {
  method: 'post',
  path: '/api/v1/budgets/creation',
  secured: false,
  handlers: factory.createHandlers(describeRoute({}), validator('json', CreateBudgetRequestDTO), async (c) => {
    const createBudget = await c.var.container.getAsync(CreateBudget)

    const body = c.req.valid('json')
    await createBudget.execute({
      userId: UserId.fromPrimitives(body.userId),
      month: Month.fromPrimitives(body.month),
      year: Year.fromPrimitives(body.year),
    })
    return c.body(null, 201)
  }),
} satisfies Endpoint
