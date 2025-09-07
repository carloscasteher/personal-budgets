import { DomainId } from '../hex/DomainId.ts'

export class ExtensableMoneyMovementId extends DomainId {
  private readonly TOKEN = 'ExtensableMoneyMovementId'

  static fromPrimitives(id: string): ExtensableMoneyMovementId {
    return new ExtensableMoneyMovementId(id)
  }
}