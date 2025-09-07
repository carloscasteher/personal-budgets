import { MoneyMovement } from './MoneyMovement.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'

export type IncomesPrimitives = Primitives<Incomes>

export type CreateIncomesParams = {
  salary: MoneyMovement
  fromPreviousMonth: MoneyMovement
  extras: MoneyMovement[]
}

export class Incomes {
  private salary: MoneyMovement

  private fromPreviousMonth: MoneyMovement

  private extras: MoneyMovement[]

  private constructor(
    salary: MoneyMovement,
    fromPreviousMonth: MoneyMovement,
    extras: MoneyMovement[]
  ) {
    this.salary = salary
    this.fromPreviousMonth = fromPreviousMonth
    this.extras = extras
  }

  static createNew({ salary, fromPreviousMonth, extras }: CreateIncomesParams): Incomes {
    return new Incomes(salary, fromPreviousMonth, extras)
  }

  static fromPrimitives(primitives: IncomesPrimitives): Incomes {
    return new Incomes(
      MoneyMovement.fromPrimitives(primitives.salary),
      MoneyMovement.fromPrimitives(primitives.fromPreviousMonth),
      primitives.extras.map((extra) => MoneyMovement.fromPrimitives(extra))
    )
  }

  toPrimitives() {
    return {
      salary: this.salary.toPrimitives(),
      fromPreviousMonth: this.fromPreviousMonth.toPrimitives(),
      extras: this.extras.map((extra) => extra.toPrimitives()),
    }
  }
}
