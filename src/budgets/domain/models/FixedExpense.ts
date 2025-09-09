import { ExtensableMoneyMovement } from './ExtensableMoneyMovement.ts'
import { ExtensableMoneyMovementId } from '../../../shared/domain/models/ids/ExtensableMoneyMovementId.ts'
import { FixedExpenseId } from '../../../shared/domain/models/ids/FixedExpenseId.ts'
import { MoneyAmount } from './MoneyAmount.ts'
import { MoneyMovement } from './MoneyMovement.ts'
import type { Month } from './Month.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { UuidGeneratorRandom } from '../../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'
import type { Year } from './Year.ts'

export type CreateFixedExpenseParams = {
  startDate: Date
  endDate: Date
  description: string
  amount: MoneyAmount
  date: Date
  userId: UserId
}

export type FixedExpensePrimitives = Primitives<FixedExpense>

export class FixedExpense extends ExtensableMoneyMovement {
  private userId: UserId

  private constructor(
    startDate: Date,
    endDate: Date,
    id: FixedExpenseId,
    description: string,
    amount: MoneyAmount,
    date: Date,
    userId: UserId
  ) {
    super(startDate, endDate, id, description, amount, date)
    this.userId = userId
  }

  static createNew({
    startDate,
    endDate,
    description,
    amount,
    date,
    userId,
  }: CreateFixedExpenseParams): FixedExpense {
    const id = ExtensableMoneyMovementId.fromPrimitives(UuidGeneratorRandom.generate())
    return new FixedExpense(startDate, endDate, id, description, amount, date, userId)
  }

  static fromPrimitives(primitives: FixedExpensePrimitives): FixedExpense {
    return new FixedExpense(
      primitives.startDate,
      primitives.endDate,
      FixedExpenseId.fromPrimitives(primitives.id),
      primitives.description,
      MoneyAmount.fromCents(primitives.amount),
      primitives.date,
      UserId.fromPrimitives(primitives.userId)
    )
  }

  toPrimitives() {
    return {
      id: this.id.toPrimitives(),
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      amount: this.amount.getValue(),
      date: this.date,
      userId: this.userId.toPrimitives(),
    }
  }

  toMoneyMovement(year: Year, month: Month) {
    const day = this.date.getDate() < 10 ? `0${this.date.getDate()}` : this.date.getDate()
    const date = new Date(`${year.toPrimitives()}-${month.toPrimitives()}-${day}`).toUTCString()
    return MoneyMovement.createNew({
      description: this.description,
      amount: this.amount,
      date: new Date(date),
    })
  }

  getId() {
    return this.id
  }
}
