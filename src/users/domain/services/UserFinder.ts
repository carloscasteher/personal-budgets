import { DomainService } from '../../../shared/domain/models/hex/DomainService.ts'
import type { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { UserNotFoundError } from '../errors/UserNotFoundError.ts'
import type { UsersRepository } from '../repositories/UsersRepository.ts'

export class UserFinder extends DomainService {
  private readonly usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    super()
    this.usersRepository = usersRepository
  }

  async findOrThrowBy(id: UserId) {
    const user = await this.usersRepository.findOneById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }
}
