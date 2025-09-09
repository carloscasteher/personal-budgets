import { BindingScopeEnum, Container } from 'inversify'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import { EmailAddress } from '../../../shared/domain/models/EmailAddress.ts'
import { HashedPassword } from '../../../shared/domain/models/HashedPassword.ts'
import { PlainPassword } from '../../../shared/domain/models/PlainPassword.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { Token } from '../../../shared/domain/services/Token.ts'
import { User } from '../../domain/models/User.ts'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import type { UsersRepository } from '../../domain/repositories/UsersRepository.ts'
import { UsersRepositoryMongo } from './UsersRepositoryMongo.ts'
import { UuidGeneratorRandom } from '../../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'
import { mongoModule } from '../../../shared/infrastructure/repositories/CreateMongoClient.ts'
import { testMongoOptions } from '../../../../test/config/testMongoOptions.ts'

describe('UsersRepositoryMongo', () => {
  const container = new Container({ defaultScope: BindingScopeEnum.Singleton })
  container.bind(UsersRepositoryMongo).toDynamicValue(UsersRepositoryMongo.create)
  container.load(mongoModule)
  container.rebind(Token.DB_CONFIG).toConstantValue(testMongoOptions)

  describe.each([{ repositoryClass: UsersRepositoryMongo }])(
    '$repositoryClass.name',
    ({ repositoryClass }) => {
      let usersRepository: UsersRepository & Reseteable & Closable

      beforeAll(async () => {
        usersRepository = await container.getAsync(repositoryClass)
      })

      beforeEach(async () => {
        await usersRepository.reset()
      })

      afterAll(async () => {
        await usersRepository.close()
      })

      it('should save a user', async () => {
        const email = EmailAddress.fromPrimitives('test@example.com')
        const password = PlainPassword.fromPrimitives('testPassword123')
        const user = User.register('Juan', 'Pérez', email, password, new Date(), 'test-salt-123')

        await usersRepository.save(user)

        const userPrimitives = user.toPrimitives()
        const savedUser = await usersRepository.findOneById(
          UserId.fromPrimitives(userPrimitives.id)
        )

        expect(savedUser).toEqual(user)
      })

      it('should find a user by id', async () => {
        const userId = new UserId(UuidGeneratorRandom.generate())
        const email = EmailAddress.fromPrimitives('find@example.com')
        const hashedPassword = HashedPassword.fromPrimitives('hashed-password-123')
        const user = new User(
          userId,
          'Ana',
          'García',
          email,
          hashedPassword,
          'salt-123',
          new Date()
        )

        await usersRepository.save(user)

        const foundUser = await usersRepository.findOneById(userId)

        expect(foundUser).toEqual(user)
      })

      it('should return undefined when user not found by id', async () => {
        const nonExistentUserId = new UserId(UuidGeneratorRandom.generate())

        const foundUser = await usersRepository.findOneById(nonExistentUserId)

        expect(foundUser).toBeUndefined()
      })

      it('should check if user exists with email', async () => {
        const email = EmailAddress.fromPrimitives('exists@example.com')
        const password = PlainPassword.fromPrimitives('password123')
        const user = User.register('Carlos', 'López', email, password, new Date(), 'salt-456')

        await usersRepository.save(user)

        const exists = await usersRepository.existsWith(email)
        const notExists = await usersRepository.existsWith(
          EmailAddress.fromPrimitives('nonexistent@example.com')
        )

        expect(exists).toBe(true)
        expect(notExists).toBe(false)
      })
    }
  )
})
