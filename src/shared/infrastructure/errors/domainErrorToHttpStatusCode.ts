import { DomainErrorCode } from '../../domain/errors/DomainErrorCode.ts'

const HttpStatus = {
  BAD_REQUEST: 400,
  CONFLICT: 409,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
} as const

type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus]

export const domainErrorToHttpStatusCode: Record<DomainErrorCode, HttpStatus> = {
  [DomainErrorCode.INTERNAL_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
}
