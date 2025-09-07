import { z } from '../../../../shared/infrastructure/controllers/zod.ts'

export const CreateBudgetRequestDTO = z
  .object({
    userId: z.string().uuid(),
    month: z.number(),
    year: z.number(),
  })
