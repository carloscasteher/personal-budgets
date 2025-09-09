import { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'
import { HashedPassword } from '../../../shared/domain/models/HashedPassword.ts'
import { PlainPassword } from '../../../shared/domain/models/PlainPassword.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { UuidGeneratorRandom } from '../../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'

export type UserPrimitives = Primitives<User>

export class User {
  private id: UserId

  private name: string

  private lastName: string

  private email: EmailAddress

  private password: HashedPassword

  private salt: string

  private createdAt: Date

  private updatedAt?: Date

  constructor(
    id: UserId,
    name: string,
    lastName: string,
    email: EmailAddress,
    password: HashedPassword,
    salt: string,
    createdAt: Date,
    updatedAt?: Date
  ) {
    this.id = id
    this.name = name
    this.lastName = lastName
    this.email = email
    this.password = password
    this.salt = salt
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static register(
    name: string,
    lastName: string,
    email: EmailAddress,
    password: PlainPassword,
    createdAt: Date,
    salt: string
  ): User {
    const hash = password.toHashed(salt)
    const id = new UserId(UuidGeneratorRandom.generate())
    return new User(id, name, lastName, email, hash, salt, createdAt)
  }

  static fromPrimitives({
    id,
    name,
    lastName,
    email,
    password,
    salt,
    createdAt,
    updatedAt,
  }: UserPrimitives): User {
    return new User(
      UserId.fromPrimitives(id),
      name,
      lastName,
      EmailAddress.fromPrimitives(email),
      HashedPassword.fromPrimitives(password),
      salt,
      createdAt,
      updatedAt ? new Date(updatedAt) : undefined
    )
  }

  private hasPassword(plainPassword: PlainPassword) {
    const hash = plainPassword.toHashed(this.salt)
    return this.password.equalsTo(hash)
  }

  toPrimitives() {
    return {
      id: this.id.toPrimitives(),
      name: this.name,
      lastName: this.lastName,
      email: this.email.toPrimitives(),
      password: this.password.toPrimitives(),
      salt: this.salt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  getId() {
    return this.id
  }

  has(value: PlainPassword) {
    if (value instanceof PlainPassword) {
      return this.hasPassword(value)
    }

    return false
  }

  doesNotHaveMatching(password: PlainPassword) {
    return !this.has(password)
  }
}
