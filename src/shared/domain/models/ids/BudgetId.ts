import { DomainId } from '../hex/DomainId.ts'

export class BudgetId extends DomainId {
  private readonly TOKEN = 'BudgetId'

  static fromPrimitives(id: string): BudgetId {
    return new BudgetId(id)
  }
}
