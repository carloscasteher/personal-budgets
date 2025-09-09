import type { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'
import type { User } from '../models/User.ts'
import type { UserId } from '../../../shared/domain/models/ids/UserId.ts'

export interface UsersRepository {
  save(user: User): Promise<void>
  findOneById(id: UserId): Promise<User | undefined>
  existsWith(email: EmailAddress): Promise<boolean>
  findBy(email: EmailAddress): Promise<User | undefined>
}
