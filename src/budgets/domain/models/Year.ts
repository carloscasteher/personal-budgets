import { ValueObject } from "../../../shared/domain/models/hex/ValueObject.ts";

export class Year extends ValueObject {
    private value: number

    private constructor(value: number) {
        super()
        this.value = value
    }

    static fromPrimitives(value: number): Year {
        return new Year(value)
    }

    toPrimitives() {
        return this.value
    }

    private static validate(value: number) {
        if (value < 2000 || value > 2100) {
            throw new Error('Year must be between 2000 and 2100') // TODO: Create a custom error
        }
    }
}