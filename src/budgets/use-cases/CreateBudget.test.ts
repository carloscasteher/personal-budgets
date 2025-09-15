import { beforeEach, describe, expect, it } from 'vitest'

import { BudgetId } from '../../shared/domain/models/ids/BudgetId.ts'
import { BudgetsQuery } from '../domain/models/BudgetsQuery.ts'
import type { BudgetsRepository } from '../domain/repositories/BudgetsRepository.ts'
import { BudgetsRepositoryMemory } from '../infrastructure/repositories/BudgetsRepositoryMemory.ts'
import { CreateBudget } from './CreateBudget.ts'
import { Expenses } from '../domain/models/Expenses.ts'
import { FixedExpense } from '../domain/models/FixedExpense.ts'
import type { FixedExpensesRepository } from '../domain/repositories/FixedExpensesRepository.ts'
import { FixedExpensesRepositoryMemory } from '../infrastructure/repositories/FixedExpensesRepositoryMemory.ts'
import { Incomes } from '../domain/models/Incomes.ts'
import { MoneyAmount } from '../domain/models/MoneyAmount.ts'
import { Month } from '../domain/models/Month.ts'
import { UserId } from '../../shared/domain/models/ids/UserId.ts'
import { UuidGeneratorRandom } from '../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'
import { Year } from '../domain/models/Year.ts'

describe('CreateBudget', () => {
  let createBudget: CreateBudget
  let budgetsRepository: BudgetsRepository
  let fixedExpensesRepository: FixedExpensesRepository

  beforeEach(() => {
    budgetsRepository = BudgetsRepositoryMemory.create()
    fixedExpensesRepository = FixedExpensesRepositoryMemory.create()
    createBudget = new CreateBudget(budgetsRepository, fixedExpensesRepository)
  })

  it('should create a new budget with empty values', async () => {
    const userId = UserId.fromPrimitives(UuidGeneratorRandom.generate())
    const month = Month.fromPrimitives(1)
    const year = Year.fromPrimitives(2021)
    await createBudget.execute({
      userId,
      month,
      year,
    })

    const savedBudget = await budgetsRepository.findManyBy(BudgetsQuery.createNew({ userId, month, year }))

    expect(savedBudget[0]).toEqual(
      expect.objectContaining({
        id: expect.any(BudgetId),
        userId,
        month,
        year,
        incomes: Incomes.createEmpty(),
        expenses: Expenses.createEmpty(),
        saving: MoneyAmount.fromCents(0),
      })
    )
  })

  it('should create a new budget with fixed expenses', async () => {
    const userId = UserId.fromPrimitives(UuidGeneratorRandom.generate())
    const month = Month.fromPrimitives(9)
    const year = Year.fromPrimitives(2025)
    await fixedExpensesRepository.save(
      FixedExpense.createNew({
        startDate: new Date('2025-08-09'),
        endDate: new Date('2026-04-09'),
        description: 'Mac mini',
        amount: MoneyAmount.fromCents(150_00),
        userId,
      })
    )

    await createBudget.execute({
      userId,
      month,
      year,
    })

    const savedBudget = await budgetsRepository.findManyBy(BudgetsQuery.createNew({ userId, month, year }))

    expect(savedBudget[0]).toEqual(
      expect.objectContaining({
        userId,
        month,
        year,
        expenses: expect.objectContaining({
          fixed: expect.arrayContaining([
            expect.objectContaining({
              description: 'Mac mini',
              amount: MoneyAmount.fromCents(150_00),
              date: new Date('2025-09-09'),
            }),
          ]),
        }),
      })
    )
  })
})
