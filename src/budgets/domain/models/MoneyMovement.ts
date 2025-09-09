import { MoneyAmount } from './MoneyAmount.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'

export type CreateBudgetParams = {
  description: string
  amount: MoneyAmount
  date: Date
}

export type MoneyMovementPrimitives = Primitives<MoneyMovement>

export class MoneyMovement {
  protected description: string

  protected amount: MoneyAmount

  protected date: Date

  protected constructor(description: string, amount: MoneyAmount, date: Date) {
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
      MoneyAmount.fromCents(primitives.amount),
      primitives.date
    )
  }

  toPrimitives() {
    return {
      description: this.description,
      amount: this.amount.getValue(),
      date: this.date,
    }
  }
}
