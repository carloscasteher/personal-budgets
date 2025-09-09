export const ApiTag = {
  BUDGETS: 'Budgets',
  USERS: 'Users',
}

export type ApiTag = (typeof ApiTag)[keyof typeof ApiTag]