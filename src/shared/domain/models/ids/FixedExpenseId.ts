import { ExtensableMoneyMovementId } from './ExtensableMoneyMovementId.ts'

export class FixedExpenseId extends ExtensableMoneyMovementId {
  static fromPrimitives(id: string): FixedExpenseId {
    return new FixedExpenseId(id)
  }
}
