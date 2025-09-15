import type { interfaces } from 'inversify'
import { type Collection, Db } from 'mongodb'
import { BudgetId } from '../../../shared/domain/models/ids/BudgetId.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { Budget, type BudgetPrimitives } from '../../domain/models/Budget.ts'
import type { BudgetsQuery } from '../../domain/models/BudgetsQuery.ts'
import type { BudgetsRepository } from '../../domain/repositories/BudgetsRepository.ts'

export class BudgetsRepositoryMongo implements BudgetsRepository, Reseteable, Closable {
  public static async create({ container }: interfaces.Context) {
    const db = await container.getAsync(Db)
    return new BudgetsRepositoryMongo(db)
  }

  private readonly budgets: Collection<BudgetPrimitives>

  constructor(db: Db) {
    this.budgets = db.collection('budgets')
  }

  async save(budget: Budget): Promise<void> {
    const primitives = budget.toPrimitives()
    await this.budgets.updateOne({ id: primitives.id }, { $set: primitives }, { upsert: true })
  }

  async findOneById(id: BudgetId): Promise<Budget | undefined> {
    const primitives = await this.budgets.findOne({ id: id.toPrimitives() })
    if (!primitives) return undefined
    return Budget.fromPrimitives(primitives)
  }

  async findManyBy(query: BudgetsQuery): Promise<Budget[]> {
    const filter: Record<string, unknown> = {
      ...{ userId: query.userId.toPrimitives() },
      ...(query.month ? { month: query.month.toPrimitives() } : {}),
      ...(query.year ? { year: query.year.toPrimitives() } : {}),
    }

    const primitives = await this.budgets.find(filter).toArray()

    return primitives.map(Budget.fromPrimitives)
  }

  async reset() {
    await this.budgets.deleteMany()
  }

  async close(): Promise<void> {}
}
