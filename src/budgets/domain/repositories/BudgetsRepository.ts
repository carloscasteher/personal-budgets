import type { Budget } from '../models/Budget.ts'
import type { BudgetId } from '../../../shared/domain/models/ids/BudgetId.ts'
import type { BudgetsQuery } from '../models/BudgetsQuery.ts'
import type { Month } from '../models/Month.ts'
import type { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import type { Year } from '../models/Year.ts'

export interface BudgetsRepository {
  save(budget: Budget): Promise<void>
  findOneById(id: BudgetId): Promise<Budget | undefined>
  findManyBy(query: BudgetsQuery): Promise<Budget[]>
}
