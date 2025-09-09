import { BindingScopeEnum, Container } from 'inversify'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import { FixedExpense } from '../../domain/models/FixedExpense.ts'
import type { FixedExpensesRepository } from '../../domain/repositories/FixedExpensesRepository.ts'
import { FixedExpensesRepositoryMongo } from './FixedExpensesRepositoryMongo.ts'
import { MoneyAmount } from '../../domain/models/MoneyAmount.ts'
import { Month } from '../../domain/models/Month.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { Token } from '../../../shared/domain/services/Token.ts'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { UuidGeneratorRandom } from '../../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'
import { Year } from '../../domain/models/Year.ts'
import { mongoModule } from '../../../shared/infrastructure/repositories/CreateMongoClient.ts'
import { testMongoOptions } from '../../../../test/config/testMongoOptions.ts'

describe('FixedExpensesRepositoryMongo', () => {
  const container = new Container({ defaultScope: BindingScopeEnum.Singleton })
  container.bind(FixedExpensesRepositoryMongo).toDynamicValue(FixedExpensesRepositoryMongo.create)
  container.load(mongoModule)
  container.rebind(Token.DB_CONFIG).toConstantValue(testMongoOptions)
  describe.each([{ repositoryClass: FixedExpensesRepositoryMongo }])(
    '$repositoryClass.name',
    ({ repositoryClass }) => {
      let fixedExpensesRepository: FixedExpensesRepository & Reseteable & Closable

      beforeAll(async () => {
        fixedExpensesRepository = await container.getAsync(repositoryClass)
      })

      beforeEach(async () => {
        await fixedExpensesRepository.reset()
      })

      afterAll(async () => {
        await fixedExpensesRepository.close()
      })

      it('should save a fixed expense', async () => {
        const fixedExpense = FixedExpense.createNew({
          startDate: new Date(),
          endDate: new Date(),
          description: 'Fixed expense',
          amount: MoneyAmount.fromCents(100),
          userId: new UserId(UuidGeneratorRandom.generate()),
        })

        await fixedExpensesRepository.save(fixedExpense)

        const savedFixedExpense = await fixedExpensesRepository.findOneById(fixedExpense.getId())

        expect(savedFixedExpense).toEqual(fixedExpense)
      })

      it('should find all active fixed expenses by user id', async () => {
        const userId = new UserId(UuidGeneratorRandom.generate())
        const fixedExpense = FixedExpense.createNew({
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-12-01'),
          description: 'Fixed expense',
          amount: MoneyAmount.fromCents(100_00),
          userId,
        })
        const fixedExpense2 = FixedExpense.createNew({
          startDate: new Date('2025-02-01'),
          endDate: new Date('2025-08-01'),
          description: 'Fixed expense 2',
          amount: MoneyAmount.fromCents(150_00),
          userId,
        })
        await fixedExpensesRepository.save(fixedExpense)
        await fixedExpensesRepository.save(fixedExpense2)
        const savedFixedExpenses = await fixedExpensesRepository.findAllActivesByUserId(
          userId,
          Month.fromPrimitives(4),
          Year.fromPrimitives(2025)
        )

        expect(savedFixedExpenses).toEqual([fixedExpense, fixedExpense2])
      })
    }
  )
})
