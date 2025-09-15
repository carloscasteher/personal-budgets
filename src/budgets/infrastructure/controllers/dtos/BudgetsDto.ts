import type { Budget } from '../../../domain/models/Budget.ts'
import { BudgetDto } from './BudgetDto.ts'

type BudgetsByYear = {
  year: number
  budgets: BudgetDto[]
}[]

export class BudgetsDto {
  readonly budgets: BudgetsByYear

  constructor(budgets: Budget[]) {
    const years = [...new Set(budgets.map((budget) => budget.getYear().toPrimitives()))]

    this.budgets = years.map((year) => ({
      year,
      budgets: budgets
        .filter((budget) => budget.getYear().toPrimitives() === year)
        .map((budget) => new BudgetDto(budget)),
    }))
  }
}
