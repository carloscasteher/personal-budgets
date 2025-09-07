import { ExtensableMoneyMovementId } from '../../../shared/domain/models/ids/ExtensableMoneyMovementId.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { UuidGeneratorRandom } from '../../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'

export type CreateBudgetParams = {
  description: string
  amount: number
  date: Date
}

export type MoneyMovementPrimitives = Primitives<MoneyMovement>

export class MoneyMovement {
  protected description: string

  protected amount: number

  protected date: Date

  protected constructor(description: string, amount: number, date: Date) {
    this.description = description
    this.amount = amount
    this.date = date
  }

  static createNew({ description, amount, date }: CreateBudgetParams) {
    return new MoneyMovement(description, amount, date)
  }

  static fromPrimitives(primitives: MoneyMovementPrimitives) {
    return new MoneyMovement(
      primitives.description,
      primitives.amount,
      primitives.date
    )
  }

  toPrimitives() {
    return {
      description: this.description,
      amount: this.amount,
      date: this.date,
    }
  }
}
