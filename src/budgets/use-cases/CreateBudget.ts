import type { interfaces } from 'inversify'
import type { UserId } from '../../shared/domain/models/ids/UserId.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import { Budget, type CreateBudgetParams } from '../domain/models/Budget.ts'
import type { Month } from '../domain/models/Month.ts'
import type { Year } from '../domain/models/Year.ts'
import type { BudgetsRepository } from '../domain/repositories/BudgetsRepository.ts'

export class CreateBudget {
  public static async create({ container }: interfaces.Context) {
    return new CreateBudget(
      ...(await Promise.all([container.getAsync<BudgetsRepository>(Token.BUDGETS_REPOSITORY)]))
    )
  }

  private readonly budgetsRepository: BudgetsRepository

  constructor(budgetsRepository: BudgetsRepository) {
    this.budgetsRepository = budgetsRepository
  }

  async execute({ userId, month, year, incomes, expenses, saving }: CreateBudgetParams) {
    await this.ensureBudgetDoesNotAlreadyExist(userId, month, year)

    const budget = Budget.createNew({ userId, month, year, incomes, expenses, saving })
    await this.budgetsRepository.save(budget)
  }

  private async ensureBudgetDoesNotAlreadyExist(userId: UserId, month: Month, year: Year) {
    const budget = await this.budgetsRepository.findOneByUserIdMonthAndYear(userId, month, year)
    if (budget) {
      throw new Error('Budget already exists') // TODO: create a custom error
    }
  }
}
