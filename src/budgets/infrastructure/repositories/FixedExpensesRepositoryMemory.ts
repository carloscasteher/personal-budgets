import type { FixedExpenseId } from '../../../shared/domain/models/ids/FixedExpenseId.ts'
import type { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { FixedExpense, type FixedExpensePrimitives } from '../../domain/models/FixedExpense.ts'
import { Month } from '../../domain/models/Month.ts'
import { Year } from '../../domain/models/Year.ts'
import type { FixedExpensesRepository } from '../../domain/repositories/FixedExpensesRepository.ts'

export class FixedExpensesRepositoryMemory
  implements FixedExpensesRepository, Reseteable, Closable
{
  public static create() {
    return new FixedExpensesRepositoryMemory()
  }

  protected fixedExpenses: Map<string, FixedExpensePrimitives> = new Map()

  async save(fixedExpense: FixedExpense): Promise<void> {
    this.saveSync(fixedExpense)
  }

  protected saveSync(fixedExpense: FixedExpense) {
    const fixedExpensePrimitives = fixedExpense.toPrimitives()
    this.fixedExpenses.set(fixedExpensePrimitives.id, fixedExpensePrimitives)
  }

  async findOneById(id: FixedExpenseId): Promise<FixedExpense | undefined> {
    const fixedExpensePrimitives = this.fixedExpenses.get(id.toPrimitives())
    if (!fixedExpensePrimitives) return undefined
    return FixedExpense.fromPrimitives(fixedExpensePrimitives)
  }

  async findAllActivesByUserId(userId: UserId, month: Month, year: Year): Promise<FixedExpense[]> {
    const date = new Date(`${year.toPrimitives()}-${month.toPrimitives()}-01:00:00`)
    const fixedExpenses = Array.from(this.fixedExpenses.values()).filter((fixedExpense) => {
      return (
        fixedExpense.userId === userId.toPrimitives() &&
        fixedExpense.endDate >= date &&
        fixedExpense.startDate <= date
      )
    })
    return fixedExpenses.map((fixedExpense) => FixedExpense.fromPrimitives(fixedExpense))
  }

  async reset() {
    this.fixedExpenses.clear()
  }

  async close(): Promise<void> {}
}
