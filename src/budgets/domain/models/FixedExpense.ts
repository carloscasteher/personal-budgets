import { ExtensableMoneyMovement } from './ExtensableMoneyMovement.ts'
import { ExtensableMoneyMovementId } from '../../../shared/domain/models/ids/ExtensableMoneyMovementId.ts'
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
    id: ExtensableMoneyMovementId,
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
}
