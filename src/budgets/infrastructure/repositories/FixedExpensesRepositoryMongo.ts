import type { interfaces } from 'inversify'
import { Collection, Db } from 'mongodb'
import { FixedExpense, type FixedExpensePrimitives } from '../../domain/models/FixedExpense.ts'
import type { FixedExpensesRepository } from '../../domain/repositories/FixedExpensesRepository.ts'

export class FixedExpensesRepositoryMongo implements FixedExpensesRepository {
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
}
