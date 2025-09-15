import { z } from '../../../../shared/infrastructure/controllers/zod.ts'

export const GetBudgetsQueryDto = z.object({
  month: z.number().optional(),
  year: z.number().optional(),
})
