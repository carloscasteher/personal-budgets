import type { ExtensableMoneyMovementId } from '../../../shared/domain/models/ids/ExtensableMoneyMovementId.ts'
import { FixedExpense, type FixedExpensePrimitives } from '../../domain/models/FixedExpense.ts'
import type { FixedExpensesRepository } from '../../domain/repositories/FixedExpensesRepository.ts'

export class FixedExpensesRepositoryMemory implements FixedExpensesRepository {
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

  async findById(id: ExtensableMoneyMovementId): Promise<FixedExpense | undefined> {
    const fixedExpensePrimitives = this.fixedExpenses.get(id.toPrimitives())
    if (!fixedExpensePrimitives) return undefined
    return FixedExpense.fromPrimitives(fixedExpensePrimitives)
  }
}
