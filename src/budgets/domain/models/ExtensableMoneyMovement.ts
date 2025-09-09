import { ExtensableMoneyMovementId } from '../../../shared/domain/models/ids/ExtensableMoneyMovementId.ts'
import { MoneyAmount } from './MoneyAmount.ts'
import { MoneyMovement } from './MoneyMovement.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { UuidGeneratorRandom } from '../../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'

export type CreateExtensableMoneyMovementParams = {
  startDate: Date
  endDate: Date
  description: string
  amount: MoneyAmount
  date: Date
}

export type ExtensableMoneyMovementPrimitives = Primitives<ExtensableMoneyMovement>

export class ExtensableMoneyMovement extends MoneyMovement {
  protected id: ExtensableMoneyMovementId

  protected startDate: Date

  protected endDate: Date

  protected constructor(
    startDate: Date,
    endDate: Date,
    id: ExtensableMoneyMovementId,
    description: string,
    amount: MoneyAmount,
    date: Date
  ) {
    super(description, amount, date)
    this.id = id
    this.startDate = startDate
    this.endDate = endDate
  }

  static createNew({
    startDate,
    endDate,
    description,
    amount,
    date,
  }: CreateExtensableMoneyMovementParams): ExtensableMoneyMovement {
    const id = ExtensableMoneyMovementId.fromPrimitives(UuidGeneratorRandom.generate())
    return new ExtensableMoneyMovement(startDate, endDate, id, description, amount, date)
  }

  static fromPrimitives(primitives: ExtensableMoneyMovementPrimitives): ExtensableMoneyMovement {
    return new ExtensableMoneyMovement(
      primitives.startDate,
      primitives.endDate,
      ExtensableMoneyMovementId.fromPrimitives(primitives.id),
      primitives.description,
      MoneyAmount.fromCents(primitives.amount),
      primitives.date
    )
  }

  toPrimitives() {
    return {
      id: this.id.toString(),
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      amount: this.amount.getValue(),
      date: this.date,
    }
  }
}
