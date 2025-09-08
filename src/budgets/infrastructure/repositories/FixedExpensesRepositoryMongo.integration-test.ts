import { BindingScopeEnum, Container } from 'inversify'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import { FixedExpense } from '../../domain/models/FixedExpense.ts'
import type { FixedExpensesRepository } from '../../domain/repositories/FixedExpensesRepository.ts'
import { FixedExpensesRepositoryMongo } from './FixedExpensesRepositoryMongo.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { Token } from '../../../shared/domain/services/Token.ts'
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
          amount: 100,
          date: new Date(),
        })

        await fixedExpensesRepository.save(fixedExpense)

        const savedFixedExpense = await fixedExpensesRepository.findOneById(fixedExpense.getId())

        expect(savedFixedExpense).toEqual(fixedExpense)
      })
    }
  )
})
