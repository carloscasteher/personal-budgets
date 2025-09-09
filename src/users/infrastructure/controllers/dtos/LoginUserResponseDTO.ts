import { z } from '../../../../shared/infrastructure/controllers/zod.ts'
import type zod from 'zod'

export const LoginUserResponseDTO = z
  .object({
    accessToken: z.string().openapi({ example: 'jwt' }),
  })
  .openapi({
    ref: 'LoginUserResponse',
    description:
      'Response returned upon successful authentication of a user. It contains the JWT access token required for authorized requests.',
  })

export type LoginUserResponseDTO = zod.infer<typeof LoginUserResponseDTO>
