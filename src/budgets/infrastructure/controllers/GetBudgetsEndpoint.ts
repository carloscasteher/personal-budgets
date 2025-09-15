import { validator } from 'hono-openapi/zod'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { factory, type Endpoint } from '../../../shared/infrastructure/controllers/factory.ts'
import { Month } from '../../domain/models/Month.ts'
import { Year } from '../../domain/models/Year.ts'

import { describeRoute } from 'hono-openapi'

import type { JwtDecoder } from '../../../shared/domain/services/JwtDecoder.ts'
import { Token } from '../../../shared/domain/services/Token.ts'
import { ApiTag } from '../../../shared/infrastructure/controllers/schemas/ApiTag.ts'
import { BudgetsQuery } from '../../domain/models/BudgetsQuery.ts'
import { GetBudgets } from '../../use-cases/GetBudgets.ts'
import { BudgetsDto } from './dtos/BudgetsDto.ts'
import { GetBudgetsQueryDto } from './dtos/GetBudgetsQueryDto.ts'

export const GetBudgetsEndpoint = {
  method: 'get',
  path: '/api/v1/budgets',
  handlers: factory.createHandlers(
    describeRoute({
      summary: 'Get budgets',
      description: 'Gets budgets by filters query',
      tags: [ApiTag.BUDGETS],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Budgets retrieved',
        },
      },
    }),
    validator('query', GetBudgetsQueryDto),
    async (context) => {
      const getBudgets = await context.var.container.getAsync(GetBudgets)
      const jwtDecoder = await context.var.container.getAsync<JwtDecoder>(Token.JWT_DECODER)
      const token = context.req.header('Authorization')?.split('Bearer ')[1]
      if (!token) {
        return context.json({ error: 'Authentication required' }, 401)
      }
      const userIdPrimitives = jwtDecoder.decode(token).sub

      const query = context.req.valid('query')
      const budgetsQuery = BudgetsQuery.createNew({
        userId: UserId.fromPrimitives(userIdPrimitives),
        month: query.month ? Month.fromPrimitives(query.month) : undefined,
        year: query.year ? Year.fromPrimitives(query.year) : undefined,
      })
      const budgets = await getBudgets.execute(budgetsQuery)

      return context.json(new BudgetsDto(budgets))
    }
  ),
} satisfies Endpoint
