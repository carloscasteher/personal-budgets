import { BindingScopeEnum, Container } from 'inversify'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { Budget } from '../../domain/models/Budget.ts'
import type { BudgetsRepository } from '../../domain/repositories/BudgetsRepository.ts'
import { BudgetsRepositoryMongo } from './BudgetsRepositoryMongo.ts'
import type { Closable } from '../../../shared/infrastructure/repositories/Closable.ts'
import { Month } from '../../domain/models/Month.ts'
import type { Reseteable } from '../../../shared/infrastructure/repositories/Reseteable.ts'
import { Token } from '../../../shared/domain/services/Token.ts'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { UuidGeneratorRandom } from '../../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'
import { Year } from '../../domain/models/Year.ts'
import { mongoModule } from '../../../shared/infrastructure/repositories/CreateMongoClient.ts'
import { testMongoOptions } from '../../../../test/config/testMongoOptions.ts'

describe('BudgetsRepositoryMongo', () => {
  const container = new Container({ defaultScope: BindingScopeEnum.Singleton })
  container.bind(BudgetsRepositoryMongo).toDynamicValue(BudgetsRepositoryMongo.create)
  container.load(mongoModule)
  container.rebind(Token.DB_CONFIG).toConstantValue(testMongoOptions)
  describe.each([{ repositoryClass: BudgetsRepositoryMongo }])(
    '$repositoryClass.name',
    ({ repositoryClass }) => {
      let budgetRepository: BudgetsRepository & Reseteable & Closable

      beforeAll(async () => {
        budgetRepository = await container.getAsync(repositoryClass)
      })

      beforeEach(async () => {
        await budgetRepository.reset()
      })

      afterAll(async () => {
        await budgetRepository.close()
      })

      it('should save a budget', async () => {
        const budget = Budget.createNew({
          userId: new UserId(UuidGeneratorRandom.generate()),
          month: Month.fromPrimitives(1),
          year: Year.fromPrimitives(2021),
        })
        await budgetRepository.save(budget)

        const savedBudget = await budgetRepository.findOneById(budget.getId())

        expect(savedBudget).toEqual(budget)
      })

      it('should find a budget by user id', async () => {
        const userId = new UserId(UuidGeneratorRandom.generate())
        const budget = Budget.createNew({
          userId,
          month: Month.fromPrimitives(1),
          year: Year.fromPrimitives(2021),
        })
        await budgetRepository.save(budget)

        const savedBudgets = await budgetRepository.findManyByUserId(userId)

        expect(savedBudgets[0]).toEqual(budget)
      })

      it('should find a budget by user id, month and year', async () => {
        const userId = new UserId(UuidGeneratorRandom.generate())
        const month = Month.fromPrimitives(1)
        const year = Year.fromPrimitives(2021)
        const budget = Budget.createNew({
          userId,
          month,
          year,
        })
        await budgetRepository.save(budget)

        const savedBudget = await budgetRepository.findOneByUserIdMonthAndYear(userId, month, year)

        expect(savedBudget).toEqual(budget)
      })
    }
  )
})
