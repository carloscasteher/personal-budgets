import type { interfaces } from 'inversify'
import { Collection, Db } from 'mongodb'
import type { FixedExpenseId } from '../../../shared/domain/models/ids/FixedExpenseId.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { FixedExpense, type FixedExpensePrimitives } from '../../domain/models/FixedExpense.ts'
import type { FixedExpensesRepository } from '../../domain/repositories/FixedExpensesRepository.ts'

export class FixedExpensesRepositoryMongo implements FixedExpensesRepository, Reseteable, Closable {
  public static async create({ container }: interfaces.Context) {
    const db = await container.getAsync(Db)
    return new FixedExpensesRepositoryMongo(db)
  }

  private readonly fixedExpenses: Collection<FixedExpensePrimitives>

  constructor(db: Db) {
    this.fixedExpenses = db.collection('fixedExpenses')
  }

  async save(fixedExpense: FixedExpense): Promise<void> {
    const primitives = fixedExpense.toPrimitives()
    await this.fixedExpenses.updateOne(
      { id: primitives.id },
      { $set: primitives },
      { upsert: true }
    )
  }

  async findOneById(id: FixedExpenseId): Promise<FixedExpense | undefined> {
    const fixedExpensePrimitives = await this.fixedExpenses.findOne({ id: id.toPrimitives() })
    if (!fixedExpensePrimitives) return undefined
    return FixedExpense.fromPrimitives(fixedExpensePrimitives)
  }

  async reset() {
    this.fixedExpenses.deleteMany({})
  }

  async close(): Promise<void> {}
}
