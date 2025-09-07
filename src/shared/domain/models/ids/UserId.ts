import { DomainId } from "../hex/DomainId.ts"

export class UserId extends DomainId {
  private readonly TOKEN = 'UserId'

  static fromPrimitives(id: string): UserId {
    return new UserId(id)
  }
}