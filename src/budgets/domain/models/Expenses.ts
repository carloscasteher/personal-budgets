import { FixedExpense } from './FixedExpense.ts'
import { MoneyMovement } from './MoneyMovement.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'

export type CreateExpensesParams = {
  fixed: FixedExpense[]
  variable: MoneyMovement[]
}

export type ExpensesPrimitives = Primitives<Expenses>

export class Expenses {
  private fixed: FixedExpense[]

  private variable: MoneyMovement[]

  private constructor(fixed: FixedExpense[], variable: MoneyMovement[]) {
    this.fixed = fixed
    this.variable = variable
  }

  static createNew({ fixed, variable }: CreateExpensesParams): Expenses {
    return new Expenses(fixed, variable)
  }

  static fromPrimitives(primitives: ExpensesPrimitives): Expenses {
    return new Expenses(
      primitives.fixed.map((fixed) => FixedExpense.fromPrimitives(fixed)),
      primitives.variable.map((variable) => MoneyMovement.fromPrimitives(variable))
    )
  }

  toPrimitives() {
    return {
      fixed: this.fixed.map((fixed) => fixed.toPrimitives()),
      variable: this.variable.map((variable) => variable.toPrimitives()),
    }
  }
}
