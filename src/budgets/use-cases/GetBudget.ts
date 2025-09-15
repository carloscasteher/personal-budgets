import type { Budget } from '../domain/models/Budget.ts'
import { BudgetFinder } from '../domain/services/BudgetFinder.ts'
import type { BudgetId } from '../../shared/domain/models/ids/BudgetId.ts'
import type { BudgetsRepository } from '../domain/repositories/BudgetsRepository.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import { UserFinder } from '../../users/domain/services/UserFinder.ts'
import type { UserId } from '../../shared/domain/models/ids/UserId.ts'
import type { UsersRepository } from '../../users/domain/repositories/UsersRepository.ts'
import type { interfaces } from 'inversify'

export class GetBudget {
  public static async create({ container }: interfaces.Context) {
    return new GetBudget(
      ...(await Promise.all([
        container.getAsync<BudgetsRepository>(Token.BUDGETS_REPOSITORY),
        container.getAsync<UsersRepository>(Token.USERS_REPOSITORY),
      ]))
    )
  }

  private readonly usersRepository: UsersRepository

  private readonly budgetFinder: BudgetFinder

  private readonly userFinder: UserFinder

  constructor(budgetsRepository: BudgetsRepository, usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
    this.budgetFinder = new BudgetFinder(budgetsRepository)
    this.userFinder = new UserFinder(usersRepository)
  }

  async execute(userId: UserId, budgetId: BudgetId): Promise<Budget> {
    await this.userFinder.findOrThrowBy(userId)
    
    return this.budgetFinder.findOrThrowBy(budgetId)
  }
}
