import { BudgetId } from '../../../shared/domain/models/ids/BudgetId.ts'
import type { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { Budget, type BudgetPrimitives } from '../../domain/models/Budget.ts'
import type { Month } from '../../domain/models/Month.ts'
import type { Year } from '../../domain/models/Year.ts'
import type { BudgetsRepository } from '../../domain/repositories/BudgetsRepository.ts'

export class BudgetsRepositoryMemory implements BudgetsRepository {
  public static create() {
    return new BudgetsRepositoryMemory()
  }

  protected budgets: Map<string, BudgetPrimitives> = new Map()

  async save(budget: Budget): Promise<void> {
    this.saveSync(budget)
  }

  protected saveSync(budget: Budget) {
    const budgetPrimitives = budget.toPrimitives()
    this.budgets.set(budgetPrimitives.id, budgetPrimitives)
  }

  async findById(id: BudgetId): Promise<Budget | undefined> {
    const budgetPrimitives = this.budgets.get(id.toPrimitives())
    if (!budgetPrimitives) return undefined
    return Budget.fromPrimitives(budgetPrimitives)
  }

  async findByUserId(userId: UserId): Promise<Budget[]> {
    const budgetPrimitives = [...this.budgets.values()]
    return budgetPrimitives
      .filter((budget) => budget.userId === userId.toPrimitives())
      .map(Budget.fromPrimitives)
  }

  async findByUserIdMonthAndYear(
    userId: UserId,
    month: Month,
    year: Year
  ): Promise<Budget | undefined> {
    const budgetPrimitives = [...this.budgets.values()].find(
      (budget) =>
        budget.userId === userId.toPrimitives() && budget.month === month && budget.year === year
    )

    if (!budgetPrimitives) return undefined

    return Budget.fromPrimitives(budgetPrimitives)
  }
}
