import type { Month } from './Month.ts'
import type { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import type { Year } from './Year.ts'

export type BudgetsQueryParams = {
  userId: UserId
  month?: Month
  year?: Year
}

export class BudgetsQuery {
  userId: UserId

  month?: Month

  year?: Year

  private constructor({ userId, month, year }: BudgetsQueryParams) {
    this.userId = userId
    this.month = month
    this.year = year
  }

  static createNew({ userId, month, year }: BudgetsQueryParams) {
    return new BudgetsQuery({ userId, month, year })
  }
}
