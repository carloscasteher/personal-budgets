import { z } from '../../../../shared/infrastructure/controllers/zod.ts'

export const GetBudgetParamDto = z.object({
  budgetId: z.string().uuid(),
})
