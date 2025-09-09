import { ValueObject } from "../../../shared/domain/models/hex/ValueObject.ts"

export class Day extends ValueObject {
  private value: number

  private constructor(value: number) {
    super()
    this.value = value
  }

  static fromPrimitives(value: number): Day {
    this.validate(value)
    return new Day(value)
  }

  toPrimitives() {
    return this.value
  }

  formatForDate(): string {
    return this.value.toString().padStart(2, '0')
  }

  private static validate(value: number) {
    if (value < 1 || value > 31) {
      throw new Error('Day must be between 1 and 31') // TODO: Create a custom error
    }
  }
}
