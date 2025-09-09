import { Day } from './Day.ts'
import { ExtensableMoneyMovementId } from '../../../shared/domain/models/ids/ExtensableMoneyMovementId.ts'
import { FixedExpenseId } from '../../../shared/domain/models/ids/FixedExpenseId.ts'
import { MoneyAmount } from './MoneyAmount.ts'
import { Month } from './Month.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { UuidGeneratorRandom } from '../../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'
import { Year } from './Year.ts'

export type CreateFixedExpenseParams = {
  startDate: Date
  endDate: Date
  description: string
  amount: MoneyAmount
  userId: UserId
}

export type FixedExpensePrimitives = Primitives<FixedExpense>

export class FixedExpense {
  private id: FixedExpenseId

  private userId: UserId

  private startDate: Date

  private endDate: Date

  private description: string

  private amount: MoneyAmount

  private constructor(
    id: FixedExpenseId,
    userId: UserId,
    startDate: Date,
    endDate: Date,
    description: string,
    amount: MoneyAmount
  ) {
    this.id = id
    this.userId = userId
    this.startDate = startDate
    this.endDate = endDate
    this.description = description
    this.amount = amount
  }

  static createNew({
    startDate,
    endDate,
    description,
    amount,
    userId,
  }: CreateFixedExpenseParams): FixedExpense {
    const id = FixedExpenseId.fromPrimitives(UuidGeneratorRandom.generate())
    return new FixedExpense(id, userId, startDate, endDate, description, amount)
  }

  static fromPrimitives(primitives: FixedExpensePrimitives): FixedExpense {
    return new FixedExpense(
      FixedExpenseId.fromPrimitives(primitives.id),
      UserId.fromPrimitives(primitives.userId),
      primitives.startDate,
      primitives.endDate,
      primitives.description,
      MoneyAmount.fromCents(primitives.amount)
    )
  }

  getMoneyMovementNeededData(month: Month, year: Year) {
    const day = Day.fromPrimitives(this.startDate.getDate())
    const date = new Date(`${year.toPrimitives()}-${month.formatForDate()}-${day.formatForDate()}`)
    return {
      description: this.description,
      amount: this.amount,
      date,
    }
  }

  toPrimitives() {
    return {
      id: this.id.toPrimitives(),
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      amount: this.amount.getValue(),
      userId: this.userId.toPrimitives(),
    }
  }

  getId() {
    return this.id
  }
}
