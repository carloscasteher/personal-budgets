import type { BudgetId } from '../../../shared/domain/models/ids/BudgetId.ts'
import { BudgetNotFoundError } from '../errors/BudgetNotFoundError.ts'
import type { BudgetsRepository } from '../repositories/BudgetsRepository.ts'
import { DomainService } from '../../../shared/domain/models/hex/DomainService.ts'

export class BudgetFinder extends DomainService {
  private readonly budgetsRepository: BudgetsRepository

  constructor(budgetsRepository: BudgetsRepository) {
    super()
    this.budgetsRepository = budgetsRepository
  }

  async findOrThrowBy(id: BudgetId) {
    const budget = await this.budgetsRepository.findOneById(id)

    if (!budget) {
      throw new BudgetNotFoundError(id)
    }

    return budget
  }
}
