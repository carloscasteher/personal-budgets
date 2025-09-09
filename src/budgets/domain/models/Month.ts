import { ValueObject } from '../../../shared/domain/models/hex/ValueObject.ts'

export class Month extends ValueObject {
  private value: number

  private constructor(value: number) {
    super()
    this.value = value
  }

  static fromPrimitives(value: number): Month {
    this.validate(value)
    return new Month(value)
  }

  private static validate(value: number) {
    if (value < 1 || value > 12) {
      throw new Error('Month must be between 1 and 12') // TODO: Create a custom error
    }
  }

  formatForDate(): string {
    return this.value.toString().padStart(2, '0')
  }

  toPrimitives() {
    return this.value
  }
}
