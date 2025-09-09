import { z } from '../../../../shared/infrastructure/controllers/zod.ts'

export const LoginUserRequestDTO = z.object({
  email: z.string().email(),
  password: z.string(),
})
