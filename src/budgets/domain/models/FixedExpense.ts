import { ExtensableMoneyMovement } from './ExtensableMoneyMovement.ts'
import { ExtensableMoneyMovementId } from '../../../shared/domain/models/ids/ExtensableMoneyMovementId.ts'
import { FixedExpenseId } from '../../../shared/domain/models/ids/FixedExpenseId.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { UuidGeneratorRandom } from '../../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'

export type CreateFixedExpenseParams = {
  startDate: Date
  endDate: Date
  description: string
  amount: number
  date: Date
}

export type FixedExpensePrimitives = Primitives<FixedExpense>

export class FixedExpense extends ExtensableMoneyMovement {
  private constructor(
    startDate: Date,
    endDate: Date,
    id: FixedExpenseId,
    description: string,
    amount: number,
    date: Date
  ) {
    super(startDate, endDate, id, description, amount, date)
  }

  static createNew({
    startDate,
    endDate,
    description,
    amount,
    date,
  }: CreateFixedExpenseParams): FixedExpense {
    const id = ExtensableMoneyMovementId.fromPrimitives(UuidGeneratorRandom.generate())
    return new FixedExpense(startDate, endDate, id, description, amount, date)
  }

  static fromPrimitives(primitives: FixedExpensePrimitives): FixedExpense {
    return new FixedExpense(
      primitives.startDate,
      primitives.endDate,
      FixedExpenseId.fromPrimitives(primitives.id),
      primitives.description,
      primitives.amount,
      primitives.date
    )
  }

  toPrimitives() {
    return {
      id: this.id.toPrimitives(),
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      amount: this.amount,
      date: this.date,
    }
  }

  getId() {
    return this.id
  }
}
