import { z } from '../../../../shared/infrastructure/controllers/zod.ts'

export const CreateBudgetBodyDto = z.object({
  month: z.number(),
  year: z.number(),
})
