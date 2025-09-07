import { BudgetId } from '../../../shared/domain/models/ids/BudgetId.ts'
import { Expenses } from './Expenses.ts'
import { Incomes } from './Incomes.ts'
import { MoneyMovement } from './MoneyMovement.ts'
import { Month } from './Month.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { UuidGeneratorRandom } from '../../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'
import { Year } from './Year.ts'

export type CreateBudgetParams = {
  userId: UserId
  month: Month
  year: Year
  incomes?: Incomes
  expenses?: Expenses
  saving?: MoneyMovement
}

export type BudgetPrimitives = Primitives<Budget>

export class Budget {
  private id: BudgetId

  private userId: UserId

  private month: Month

  private year: Year

  private incomes?: Incomes

  private expenses?: Expenses

  private saving?: MoneyMovement

  private constructor(
    id: BudgetId,
    userId: UserId,
    month: Month,
    year: Year,
    incomes?: Incomes,
    expenses?: Expenses,
    saving?: MoneyMovement
  ) {
    this.id = id
    this.userId = userId
    this.month = month
    this.year = year
    this.incomes = incomes
    this.expenses = expenses
    this.saving = saving
  }

  static createNew({ userId, month, year, incomes, expenses, saving }: CreateBudgetParams) {
    const id = BudgetId.fromPrimitives(UuidGeneratorRandom.generate())
    return new Budget(id, userId, month, year, incomes, expenses, saving)
  }

  static fromPrimitives(primitives: BudgetPrimitives) {
    return new Budget(
      BudgetId.fromPrimitives(primitives.id),
      UserId.fromPrimitives(primitives.userId),
      Month.fromPrimitives(primitives.month),
      Year.fromPrimitives(primitives.year),
      primitives.incomes ? Incomes.fromPrimitives(primitives.incomes) : undefined,
      primitives.expenses ? Expenses.fromPrimitives(primitives.expenses) : undefined,
      primitives.saving ? MoneyMovement.fromPrimitives(primitives.saving) : undefined
    )
  }

  toPrimitives() {
    return {
      id: this.id.toPrimitives(),
      userId: this.userId.toPrimitives(),
      month: this.month.toPrimitives(),
      year: this.year.toPrimitives(),
      incomes: this.incomes?.toPrimitives(),
      expenses: this.expenses?.toPrimitives(),
      saving: this.saving?.toPrimitives(),
    }
  }
}
