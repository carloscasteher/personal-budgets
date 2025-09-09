import { DomainId } from '../hex/DomainId.ts'

export class FixedExpenseId extends DomainId {
  private readonly TOKEN = 'FixedExpenseId'

  static fromPrimitives(id: string): FixedExpenseId {
    return new FixedExpenseId(id)
  }
}
