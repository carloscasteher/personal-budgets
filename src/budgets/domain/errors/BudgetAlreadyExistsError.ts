import { DomainError } from '../../../shared/domain/errors/DomainError.ts'
import { DomainErrorCode } from '../../../shared/domain/errors/DomainErrorCode.ts'

export class BudgetAlreadyExistsError extends DomainError {
  constructor() {
    super('Budget already exists', DomainErrorCode.BUDGET_ALREADY_EXISTS)
  }
}
