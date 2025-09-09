import { ValueObject } from '../../../shared/domain/models/hex/ValueObject.ts'

export class MoneyAmount extends ValueObject {
  private value: number

  private constructor(value: number) {
    super()
    this.value = value
  }

  static fromCents(value: number): MoneyAmount {
    this.validate(value)
    return new MoneyAmount(value)
  }

  private static validate(value: number) {
    if (value < 0) {
      throw new Error('Money amount must be greater than 0') // TODO: Create a custom error
    }
  }

  getValue() {
    return this.value
  }
}
