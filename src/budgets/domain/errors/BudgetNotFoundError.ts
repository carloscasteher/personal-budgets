import type { BudgetId } from '../../../shared/domain/models/ids/BudgetId.ts'
import { DomainError } from '../../../shared/domain/errors/DomainError.ts'
import { DomainErrorCode } from '../../../shared/domain/errors/DomainErrorCode.ts'

export class BudgetNotFoundError extends DomainError {
  constructor(budgetId: BudgetId) {
    super(`Budget with id: ${budgetId.toPrimitives()} not found`, DomainErrorCode.BUDGET_NOT_FOUND)
  }
}
