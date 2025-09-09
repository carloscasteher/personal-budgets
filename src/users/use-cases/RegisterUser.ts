import type { Crypto } from '../../shared/domain/services/Crypto.ts'
import type { EmailAddress } from '../../shared/domain/models/EmailAddress.ts'
import type { PlainPassword } from '../../shared/domain/models/PlainPassword.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import { UseCase } from '../../shared/domain/models/hex/UseCase.ts'
import { User } from '../domain/models/User.ts'
import type { UserId } from '../../shared/domain/models/ids/UserId.ts'
import type { UsersRepository } from '../domain/repositories/UsersRepository.ts'
import type { interfaces } from 'inversify'

export type RegisterUserParams = {
  name: string
  lastName: string
  email: EmailAddress
  password: PlainPassword
}

export class RegisterUser extends UseCase {
  public static async create({ container }: interfaces.Context) {
    return new RegisterUser(
      ...(await Promise.all([
        container.getAsync<UsersRepository>(Token.USERS_REPOSITORY),
        container.getAsync<Crypto>(Token.CRYPTO),
      ]))
    )
  }

  private readonly usersRepository: UsersRepository

  private readonly crypto: Crypto

  constructor(usersRepository: UsersRepository, crypto: Crypto) {
    super()
    this.usersRepository = usersRepository
    this.crypto = crypto
  }

  async execute({ name, lastName, email, password }: RegisterUserParams) {
    const emailAlreadyExists = await this.usersRepository.existsWith(email)
    if (emailAlreadyExists) {
      throw new Error(`User with email ${email} already exists`) // TODO: Create a custom error
    }
    const user = User.register(name, lastName, email, password, await this.crypto.generateSalt())
    await this.usersRepository.save(user)
  }
}
