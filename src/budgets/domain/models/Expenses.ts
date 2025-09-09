import { MoneyMovement } from './MoneyMovement.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'

export type CreateExpensesParams = {
  fixed?: MoneyMovement[]
  variable?: MoneyMovement[]
}

export type ExpensesPrimitives = Primitives<Expenses>

export class Expenses {
  private fixed: MoneyMovement[]

  private variable: MoneyMovement[]

  private constructor(fixed?: MoneyMovement[], variable?: MoneyMovement[]) {
    this.fixed = fixed ?? []
    this.variable = variable ?? []
  }

  static createNew({ fixed, variable }: CreateExpensesParams): Expenses {
    return new Expenses(fixed, variable)
  }

  static fromPrimitives(primitives: ExpensesPrimitives): Expenses {
    return new Expenses(
      primitives.fixed.map((fixed) => MoneyMovement.fromPrimitives(fixed)),
      primitives.variable.map((variable) => MoneyMovement.fromPrimitives(variable))
    )
  }

  static createEmpty(): Expenses {
    return new Expenses()
  }

  toPrimitives() {
    return {
      fixed: this.fixed.map((fixed) => fixed.toPrimitives()),
      variable: this.variable.map((variable) => variable.toPrimitives()),
    }
  }
  
}
