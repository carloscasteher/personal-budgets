import { Budget } from '../domain/models/Budget.ts'
import type { BudgetsRepository } from '../domain/repositories/BudgetsRepository.ts'
import type { FixedExpensesRepository } from '../domain/repositories/FixedExpensesRepository.ts'
import type { Month } from '../domain/models/Month.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import type { UserId } from '../../shared/domain/models/ids/UserId.ts'
import type { Year } from '../domain/models/Year.ts'
import type { interfaces } from 'inversify'

type CreateBudgetParams = {
  userId: UserId
  month: Month
  year: Year
}

export class CreateBudget {
  public static async create({ container }: interfaces.Context) {
    return new CreateBudget(
      ...(await Promise.all([
        container.getAsync<BudgetsRepository>(Token.BUDGETS_REPOSITORY),
        container.getAsync<FixedExpensesRepository>(Token.FIXED_EXPENSES_REPOSITORY),
      ]))
    )
  }

  private readonly budgetsRepository: BudgetsRepository

  private readonly fixedExpensesRepository: FixedExpensesRepository

  constructor(
    budgetsRepository: BudgetsRepository,
    fixedExpensesRepository: FixedExpensesRepository
  ) {
    this.budgetsRepository = budgetsRepository
    this.fixedExpensesRepository = fixedExpensesRepository
  }

  async execute({ userId, month, year }: CreateBudgetParams) {
    await this.ensureBudgetDoesNotAlreadyExist(userId, month, year)
    const activeFixedExpenses = await this.fixedExpensesRepository.findAllActivesByUserId(
      userId,
      month,
      year
    )
    const fixedExpenses = activeFixedExpenses.map((fixedExpense) => fixedExpense.toMoneyMovement(year, month))

    const budget = Budget.createNew({ userId, month, year, fixedExpenses })
    await this.budgetsRepository.save(budget)
  }

  private async ensureBudgetDoesNotAlreadyExist(userId: UserId, month: Month, year: Year) {
    const budget = await this.budgetsRepository.findOneByUserIdMonthAndYear(userId, month, year)
    if (budget) {
      throw new Error('Budget already exists') // TODO: create a custom error
    }
  }
}
