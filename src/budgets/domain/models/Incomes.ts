import { MoneyAmount } from './MoneyAmount.ts'
import { MoneyMovement } from './MoneyMovement.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'

export type IncomesPrimitives = Primitives<Incomes>

export type CreateIncomesParams = {
  salary: MoneyAmount
  fromPreviousMonth?: MoneyAmount
  extras?: MoneyMovement[]
}

export class Incomes {
  private salary: MoneyAmount

  private fromPreviousMonth: MoneyAmount

  private extras: MoneyMovement[]

  private constructor(
    salary: MoneyAmount,
    fromPreviousMonth?: MoneyAmount,
    extras?: MoneyMovement[]
  ) {
    this.salary = salary
    this.fromPreviousMonth = fromPreviousMonth ?? MoneyAmount.fromCents(0)
    this.extras = extras ?? []
  }

  static createNew({ salary, fromPreviousMonth, extras }: CreateIncomesParams): Incomes {
    return new Incomes(salary, fromPreviousMonth, extras)
  }

  static fromPrimitives(primitives: IncomesPrimitives): Incomes {
    return new Incomes(
      MoneyAmount.fromCents(primitives.salary),
      MoneyAmount.fromCents(primitives.fromPreviousMonth),
      primitives.extras.map((extra) => MoneyMovement.fromPrimitives(extra))
    )
  }

  static createEmpty(): Incomes {
    return new Incomes(MoneyAmount.fromCents(0), MoneyAmount.fromCents(0))
  }

  toPrimitives() {
    return {
      salary: this.salary.getValue(),
      fromPreviousMonth: this.fromPreviousMonth.getValue(),
      extras: this.extras.map((extra) => extra.toPrimitives()),
    }
  }
}
