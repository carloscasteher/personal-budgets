export const DomainErrorCode = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
}

export type DomainErrorCode = (typeof DomainErrorCode)[keyof typeof DomainErrorCode]
