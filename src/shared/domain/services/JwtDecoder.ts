import type { JwtPayload } from '../../../auth/domain/JwtPayload.ts'

export interface JwtDecoder {
  decode(token: string): JwtPayload
}
