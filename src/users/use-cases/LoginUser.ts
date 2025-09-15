import type { Clock } from '../../shared/domain/services/Clock.ts'
import type { EmailAddress } from '../../shared/domain/models/EmailAddress.ts'
import type { JwtPayload } from '../../auth/domain/JwtPayload.ts'
import type { JwtSigner } from '../../shared/domain/services/JwtSigner.ts'
import type { PlainPassword } from '../../shared/domain/models/PlainPassword.ts'
import { Token } from '../../shared/domain/services/Token.ts'
import { UseCase } from '../../shared/domain/models/hex/UseCase.ts'
import type { User } from '../domain/models/User.ts'
import { UserInvalidLoginCredentialsError } from '../domain/errors/UserInvalidLoginCredentialsError.ts'
import { UserNotFoundError } from '../domain/errors/UserNotFoundError.ts'
import type { UsersRepository } from '../domain/repositories/UsersRepository.ts'
import { config } from '../../shared/infrastructure/config.ts'
import type { interfaces } from 'inversify'

type LoginUserParams = {
  email: EmailAddress
  password: PlainPassword
}

export class LoginUser extends UseCase {
  public static async create({ container }: interfaces.Context) {
    return new LoginUser(
      await container.getAsync(Token.USERS_REPOSITORY),
      container.get(Token.CLOCK),
      container.get(Token.JWT_SIGNER)
    )
  }

  private readonly usersRepository: UsersRepository

  private readonly clock: Clock

  private readonly jwtSigner: JwtSigner

  constructor(usersRepository: UsersRepository, clock: Clock, jwtSigner: JwtSigner) {
    super()
    this.usersRepository = usersRepository
    this.clock = clock
    this.jwtSigner = jwtSigner
  }

  async execute({ email, password }: LoginUserParams) {
    const user = await this.usersRepository.findBy(email)
    if (!user) {
      throw new UserNotFoundError(email)
    }

    if (user.doesNotHaveMatching(password)) {
      throw new UserInvalidLoginCredentialsError()
    }

    return await this.createAccessToken(user)
  }

  private async createAccessToken(user: User) {
    const now = this.clock.now()
    const nowInSeconds = now.toSeconds()
    const tomorrow = now.addDays(1)
    const tomorrowInSeconds = tomorrow.toSeconds()

    const payload: JwtPayload = {
      iat: nowInSeconds,
      sub: user.getId().toPrimitives(),
      exp: tomorrowInSeconds,
    }

    return await this.jwtSigner.sign(payload, config.jwt.secret)
  }
}
