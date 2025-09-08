export const ApiTag = {
  BUDGETS: 'Budgets',
}

export type ApiTag = (typeof ApiTag)[keyof typeof ApiTag]