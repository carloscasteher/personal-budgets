import { z } from '../../../../shared/infrastructure/controllers/zod.ts'

export const RegisterUserRequestDTO = z.object({
  name: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
})
