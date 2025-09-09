import type { interfaces } from 'inversify'
import { Collection, Db } from 'mongodb'
import type { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { User, type UserPrimitives } from '../../domain/models/User.ts'
import type { UsersRepository } from '../../domain/repositories/UsersRepository.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'

export class UsersRepositoryMongo implements UsersRepository, Reseteable, Closable {
  public static async create({ container }: interfaces.Context) {
    const db = await container.getAsync(Db)
    return new UsersRepositoryMongo(db)
  }

  private readonly users: Collection<UserPrimitives>

  constructor(db: Db) {
    this.users = db.collection('users')
  }

  async save(user: User): Promise<void> {
    const primitives = user.toPrimitives()
    await this.users.updateOne({ id: primitives.id }, { $set: primitives }, { upsert: true })
  }

  async findOneById(id: UserId): Promise<User | undefined> {
    const primitives = await this.users.findOne({ id: id.toPrimitives() })
    return primitives ? User.fromPrimitives(primitives) : undefined
  }

  async existsWith(email: EmailAddress): Promise<boolean> {
    const count = await this.users.countDocuments({ email: email.toPrimitives() })
    return count > 0
  }

  async reset() {
    await this.users.deleteMany()
  }

  async close(): Promise<void> {}
}
