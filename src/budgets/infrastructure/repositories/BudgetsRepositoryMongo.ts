import type { interfaces } from 'inversify'
import { type Collection, Db } from 'mongodb'
import { BudgetId } from '../../../shared/domain/models/ids/BudgetId.ts'
import type { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { Budget, type BudgetPrimitives } from '../../domain/models/Budget.ts'
import type { Month } from '../../domain/models/Month.ts'
import type { Year } from '../../domain/models/Year.ts'
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

  async findById(id: BudgetId): Promise<Budget | undefined> {
    const primitives = await this.budgets.findOne({ id: id.toPrimitives() })
    if (!primitives) return undefined
    return Budget.fromPrimitives(primitives)
  }

  async findByUserId(userId: UserId): Promise<Budget[]> {
    const primitives = await this.budgets.find({ userId: userId.toPrimitives() }).toArray()
    return primitives.map(Budget.fromPrimitives)
  }

  async findByUserIdMonthAndYear(
    userId: UserId,
    month: Month,
    year: Year
  ): Promise<Budget | undefined> {
    const primitives = await this.budgets.findOne({
      userId: userId.toPrimitives(),
      month: month.toPrimitives(),
      year: year.toPrimitives(),
    })
    if (!primitives) return undefined
    return Budget.fromPrimitives(primitives)
  }

  async reset() {
    await this.budgets.deleteMany()
  }

  async close(): Promise<void> {}
}
