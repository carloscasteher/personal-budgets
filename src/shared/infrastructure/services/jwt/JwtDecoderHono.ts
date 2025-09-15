import type { JwtDecoder } from '../../../domain/services/JwtDecoder.ts'
import type { JwtPayload } from '../../../../auth/domain/JwtPayload.ts'
import { decode as decodeHono } from 'hono/jwt'

export class JwtDecoderHono implements JwtDecoder {
  decode(token: string): JwtPayload {
    const { payload } = decodeHono(token)

    return {
      sub: payload.sub as string,
      iat: payload.iat as number,
      exp: payload.exp as number,
    }
  }
}
