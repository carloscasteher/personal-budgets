export const Token = {
  APP: 'APP',
  LOGGER: 'LOGGER',
  ENDPOINT: 'ENDPOINT',
  JWT_SIGNER: 'JWT_SIGNER',
  DB_CONFIG: 'DB_CONFIG',
  BUDGETS_REPOSITORY: 'BUDGETS_REPOSITORY',
} as const

export type Token = (typeof Token)[keyof typeof Token]
