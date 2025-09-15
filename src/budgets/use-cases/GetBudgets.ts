import type { Budget } from '../domain/models/Budget.ts'
import { BudgetsQuery } from '../domain/models/BudgetsQuery.ts'
import type { BudgetsRepository } from '../domain/repositories/BudgetsRepository.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import { UserNotFoundError } from '../../users/domain/errors/UserNotFoundError.ts'
import type { UsersRepository } from '../../users/domain/repositories/UsersRepository.ts'
import type { interfaces } from 'inversify'

export class GetBudgets {
  public static async create({ container }: interfaces.Context) {
    return new GetBudgets(
      ...(await Promise.all([
        container.getAsync<BudgetsRepository>(Token.BUDGETS_REPOSITORY),
        container.getAsync<UsersRepository>(Token.USERS_REPOSITORY),
      ]))
    )
  }

  private readonly budgetsRepository: BudgetsRepository

  private readonly usersRepository: UsersRepository

  constructor(budgetsRepository: BudgetsRepository, usersRepository: UsersRepository) {
    this.budgetsRepository = budgetsRepository
    this.usersRepository = usersRepository
  }

  async execute(query: BudgetsQuery): Promise<Budget[]> {
    const user = await this.usersRepository.findOneById(query.userId)
    if (!user) {
      throw new UserNotFoundError()
    }
    
    return this.budgetsRepository.findManyBy(query)
  }
}
