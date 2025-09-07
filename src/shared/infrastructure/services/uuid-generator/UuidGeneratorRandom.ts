import type { UuidGenerator } from '../../../domain/services/UuidGenerator.ts'
import { randomUUID } from 'node:crypto'

export class UuidGeneratorRandom implements UuidGenerator {
  public static generate(): string {
    return randomUUID()
  }

  generate(): string {
    return UuidGeneratorRandom.generate()
  }
}
