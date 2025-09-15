import { validator } from 'hono-openapi/zod'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { factory, type Endpoint } from '../../../shared/infrastructure/controllers/factory.ts'

import { describeRoute } from 'hono-openapi'

import { BudgetId } from '../../../shared/domain/models/ids/BudgetId.ts'
import type { JwtDecoder } from '../../../shared/domain/services/JwtDecoder.ts'
import { Token } from '../../../shared/domain/services/Token.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { GetBudget } from '../../use-cases/GetBudget.ts'
import { BudgetDto } from './dtos/BudgetDto.ts'
import { GetBudgetParamDto } from './dtos/GetBudgetParamDto.ts'

export const GetBudgetEndpoint = {
  method: 'get',
  path: '/api/v1/budgets/:budgetId',
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Get budget',
      description: 'Gets budget by id',
      tags: [ApiTag.BUDGETS],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Budget retrieved',
        },
      },
    }),
    validator('param', GetBudgetParamDto),
    async (context) => {
      const getBudget = await context.var.container.getAsync(GetBudget)
      const jwtDecoder = await context.var.container.getAsync<JwtDecoder>(Token.JWT_DECODER)
      const token = context.req.header('Authorization')?.split('Bearer ')[1]
      if (!token) {
        return context.json({ error: 'Authentication required' }, 401)
      }
      const userIdPrimitives = jwtDecoder.decode(token).sub

      const query = context.req.valid('param')

      const budget = await getBudget.execute(
        UserId.fromPrimitives(userIdPrimitives),
        BudgetId.fromPrimitives(query.budgetId)
      )

      return context.json(new BudgetDto(budget))
    }
  ),
} satisfies Endpoint
