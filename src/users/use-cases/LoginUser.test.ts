import { beforeEach, describe, expect, it } from 'vitest'

import { ClockFake } from '../../shared/infrastructure/services/clock/ClockFake.ts'
import { EmailAddress } from '../../shared/domain/models/EmailAddress.ts'
import { JwtSignerHono } from '../../shared/infrastructure/services/jwt/JwtSignerHono.ts'
import { LoginUser } from './LoginUser.ts'
import { PlainPassword } from '../../shared/domain/models/PlainPassword.ts'
import { User } from '../domain/models/User.ts'
import type { UsersRepository } from '../domain/repositories/UsersRepository.ts'
import { UsersRepositoryMemory } from '../infrastructure/repositories/UsersRepositoryMemory.ts'
import { decode } from 'hono/jwt'

describe('LoginUser', () => {
  let clock: ClockFake
  let usersRepository: UsersRepository
  let loginUser: LoginUser

  beforeEach(() => {
    clock = new ClockFake()
    usersRepository = UsersRepositoryMemory.create()
    loginUser = new LoginUser(usersRepository, clock, new JwtSignerHono())
  })

  it('returns an access token if credentials are valid', async () => {
    const now = clock.now()
    const expectedIat = now.toSeconds()
    const expectedExp = now.addDays(1).toSeconds()
    const user = User.register(
      'Concha',
      'Asensio',
      EmailAddress.fromPrimitives('concha@example.com'),
      PlainPassword.fromPrimitives('password'),
      new Date(),
      'salt'
    )
    await usersRepository.save(user)

    const accessToken = await loginUser.execute({
      email: EmailAddress.fromPrimitives('concha@example.com'),
      password: PlainPassword.fromPrimitives('password'),
    })

    const content = decode(accessToken)
    expect(content.payload.sub).toEqual(user.getId().toPrimitives())
    expect(content.payload.iat).toEqual(expectedIat)
    expect(content.payload.exp).toEqual(expectedExp)
  })

  it('fails if password is incorrect', async () => {
    const user = User.register(
      'Concha',
      'Asensio',
      EmailAddress.fromPrimitives('concha@example.com'),
      PlainPassword.fromPrimitives('password'),
      new Date(),
      'salt'
    )
    await usersRepository.save(user)

    const result = loginUser.execute({
      email: EmailAddress.fromPrimitives('concha@example.com'),
      password: new PlainPassword('wrong password'),
    })

    await expect(result).rejects.toEqual(new Error('Invalid password'))
  })

  it('fails if email is not found', async () => {
    const result = loginUser.execute({
      email: EmailAddress.fromPrimitives('jorge@example.com'),
      password: PlainPassword.fromPrimitives('password'),
    })

    await expect(result).rejects.toEqual(new Error('User not found'))
  })
})
