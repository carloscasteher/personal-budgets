import { BudgetId } from '../../../shared/domain/models/ids/BudgetId.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { Budget, type BudgetPrimitives } from '../../domain/models/Budget.ts'
import type { BudgetsQuery } from '../../domain/models/BudgetsQuery.ts'
import type { BudgetsRepository } from '../../domain/repositories/BudgetsRepository.ts'

export class BudgetsRepositoryMemory implements BudgetsRepository, Reseteable, Closable {
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

  async findOneById(id: BudgetId): Promise<Budget | undefined> {
    const budgetPrimitives = this.budgets.get(id.toPrimitives())
    if (!budgetPrimitives) return undefined
    return Budget.fromPrimitives(budgetPrimitives)
  }

  async findManyBy(query: BudgetsQuery): Promise<Budget[]> {
    const budgetPrimitives = [...this.budgets.values()]
    return budgetPrimitives
      .filter(
        (budget) =>
          budget.userId === query.userId.toPrimitives() &&
          budget.month === query.month?.toPrimitives() &&
          budget.year === query.year?.toPrimitives()
      )
      .map(Budget.fromPrimitives)
  }

  async reset() {
    this.budgets.clear()
  }

  async close(): Promise<void> {}
}
