import { beforeEach, describe, expect, it } from 'vitest'

import type { BudgetsRepository } from '../domain/repositories/BudgetsRepository.ts'
import { BudgetsRepositoryMemory } from '../infrastructure/repositories/BudgetsRepositoryMemory.ts'
import { CreateBudget } from './CreateBudget.ts'
import { Month } from '../domain/models/Month.ts'
import { UserId } from '../../shared/domain/models/ids/UserId.ts'
import { UuidGeneratorRandom } from '../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'
import { Year } from '../domain/models/Year.ts'

describe('CreateBudget', () => {
  let createBudget: CreateBudget
  let budgetsRepository: BudgetsRepository

  beforeEach(() => {
    budgetsRepository = BudgetsRepositoryMemory.create()
    createBudget = new CreateBudget(budgetsRepository)
  })

  it('should create a new budget', async () => {
    const userId = UserId.fromPrimitives(UuidGeneratorRandom.generate())
    const month = Month.fromPrimitives(1)
    const year = Year.fromPrimitives(2021)
    await createBudget.execute({
      userId,
      month,
      year,
    })

    const savedBudget = budgetsRepository.findOneByUserIdMonthAndYear(userId, month, year)

    expect(savedBudget).toBeDefined()
  })
})
