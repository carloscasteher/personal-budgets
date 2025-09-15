import type { Budget } from '../../../domain/models/Budget.ts'
import type { ExpensesPrimitives } from '../../../domain/models/Expenses.ts'
import type { IncomesPrimitives } from '../../../domain/models/Incomes.ts'
import type { MoneyMovementPrimitives } from '../../../domain/models/MoneyMovement.ts'

class MoneyMovementDto {
  readonly description: string

  readonly amount: number

  readonly date: Date

  constructor(moneyMovement: MoneyMovementPrimitives) {
    this.description = moneyMovement.description
    this.amount = moneyMovement.amount
    this.date = moneyMovement.date
  }
}

class IncomesDto {
  readonly salary: number

  readonly fromPreviousMonth: number

  readonly extras: MoneyMovementDto[]

  constructor(incomes: IncomesPrimitives) {
    this.salary = incomes.salary
    this.fromPreviousMonth = incomes.fromPreviousMonth
    this.extras = incomes.extras.map((extra) => new MoneyMovementDto(extra))
  }
}

class ExpensesDto {
  readonly fixed: MoneyMovementDto[]

  readonly variable: MoneyMovementDto[]

  constructor(expenses: ExpensesPrimitives) {
    this.fixed = expenses.fixed.map((fixed) => new MoneyMovementDto(fixed))
    this.variable = expenses.variable.map((variable) => new MoneyMovementDto(variable))
  }
}

export class BudgetDto {
  readonly id: string

  readonly userId: string

  readonly month: number

  readonly year: number

  readonly incomes: IncomesDto

  readonly expenses: ExpensesDto

  readonly saving: number

  constructor(budget: Budget) {
    const primitives = budget.toPrimitives()
    this.id = primitives.id
    this.userId = primitives.userId
    this.month = primitives.month
    this.year = primitives.year
    this.incomes = new IncomesDto(primitives.incomes)
    this.expenses = primitives.expenses
    this.saving = primitives.saving
  }
}
