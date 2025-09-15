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
  [DomainErrorCode.BUDGET_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [DomainErrorCode.BUDGET_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [DomainErrorCode.INTERNAL_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  [DomainErrorCode.USER_INVALID_LOGIN_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
  [DomainErrorCode.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [DomainErrorCode.USER_WITH_EMAIL_ALREADY_EXISTS]: HttpStatus.CONFLICT,
}
