import type { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'
import type { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { User, type UserPrimitives } from '../../domain/models/User.ts'
import type { UsersRepository } from '../../domain/repositories/UsersRepository.ts'

export class UsersRepositoryMemory implements UsersRepository, Reseteable, Closable {
  public static create() {
    return new UsersRepositoryMemory()
  }

  protected users: Map<string, UserPrimitives> = new Map()

  async save(user: User): Promise<void> {
    this.saveSync(user)
  }

  protected saveSync(user: User) {
    const userPrimitives = user.toPrimitives()
    this.users.set(userPrimitives.id, userPrimitives)
  }

  async findOneById(id: UserId): Promise<User | undefined> {
    const userPrimitives = this.users.get(id.toPrimitives())
    if (!userPrimitives) return undefined

    return User.fromPrimitives(userPrimitives)
  }

  async existsWith(email: EmailAddress): Promise<boolean> {
    return this.users.values().some((user) => user.email === email.toPrimitives())
  }

  async findBy(email: EmailAddress): Promise<User | undefined> {
    const userPrimitives = this.users.values().find((user) => user.email === email.toPrimitives())
    if (!userPrimitives) return undefined
    return User.fromPrimitives(userPrimitives)
  }

  async reset() {
    this.users.clear()
  }

  async close(): Promise<void> {}
}
