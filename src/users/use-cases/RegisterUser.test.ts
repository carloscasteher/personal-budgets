import { beforeEach, describe, expect, it } from 'vitest'

import { ClockFake } from '../../shared/infrastructure/services/clock/ClockFake.ts'
import { CryptoNode } from '../../shared/infrastructure/services/crypto/CryptoNode.ts'
import { EmailAddress } from '../../shared/domain/models/EmailAddress.ts'
import { PlainPassword } from '../../shared/domain/models/PlainPassword.ts'
import { RegisterUser } from './RegisterUser.ts'
import type { UsersRepository } from '../domain/repositories/UsersRepository.ts'
import { UsersRepositoryMemory } from '../infrastructure/repositories/UsersRepositoryMemory.ts'

describe('RegisterUser', () => {
  let registerUser: RegisterUser
  let usersRepository: UsersRepository

  beforeEach(() => {
    usersRepository = UsersRepositoryMemory.create()

    registerUser = new RegisterUser(usersRepository, new CryptoNode(), new ClockFake())
  })

  it('should register a new user with hashed password', async () => {
    const name = 'Juan'
    const lastName = 'Pérez'
    const email = EmailAddress.fromPrimitives('juan.perez@example.com')
    const password = PlainPassword.fromPrimitives('miPasswordSegura123')

    await registerUser.execute({
      name,
      lastName,
      email,
      password,
    })

    const isUserExists = await usersRepository.existsWith(email)

    expect(isUserExists).toBeTruthy()
  })
})
