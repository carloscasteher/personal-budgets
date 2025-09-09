import { BudgetId } from '../../../shared/domain/models/ids/BudgetId.ts'
import { Expenses } from './Expenses.ts'
import { Incomes } from './Incomes.ts'
import { MoneyAmount } from './MoneyAmount.ts'
import type { MoneyMovement } from './MoneyMovement.ts'
import { Month } from './Month.ts'
import type { Primitives } from '../../../shared/domain/models/hex/Primitives.ts'
import { UserId } from '../../../shared/domain/models/ids/UserId.ts'
import { UuidGeneratorRandom } from '../../../shared/infrastructure/services/uuid-generator/UuidGeneratorRandom.ts'
import { Year } from './Year.ts'

export type NewBudgetParams = {
  userId: UserId
  month: Month
  year: Year
  fixedExpensesMoneyMovements: MoneyMovement[]
}

export type BudgetPrimitives = Primitives<Budget>

export class Budget {
  private id: BudgetId

  private userId: UserId

  private month: Month

  private year: Year

  private incomes: Incomes

  private expenses: Expenses

  private saving: MoneyAmount

  private constructor(
    id: BudgetId,
    userId: UserId,
    month: Month,
    year: Year,
    expenses: Expenses,
    incomes: Incomes,
    saving: MoneyAmount
  ) {
    this.id = id
    this.userId = userId
    this.month = month
    this.year = year
    this.incomes = incomes
    this.expenses = expenses
    this.saving = saving
  }

  static createNew({ userId, month, year, fixedExpensesMoneyMovements }: NewBudgetParams) {
    return new Budget(
      BudgetId.fromPrimitives(UuidGeneratorRandom.generate()),
      userId,
      month,
      year,
      Expenses.createNew({ fixed: fixedExpensesMoneyMovements }),
      Incomes.createEmpty(),
      MoneyAmount.fromCents(0)
    )
  }

  static fromPrimitives(primitives: BudgetPrimitives) {
    return new Budget(
      BudgetId.fromPrimitives(primitives.id),
      UserId.fromPrimitives(primitives.userId),
      Month.fromPrimitives(primitives.month),
      Year.fromPrimitives(primitives.year),
      Expenses.fromPrimitives(primitives.expenses),
      Incomes.fromPrimitives(primitives.incomes),
      MoneyAmount.fromCents(primitives.saving)
    )
  }

  toPrimitives() {
    return {
      id: this.id.toPrimitives(),
      userId: this.userId.toPrimitives(),
      month: this.month.toPrimitives(),
      year: this.year.toPrimitives(),
      incomes: this.incomes.toPrimitives(),
      expenses: this.expenses.toPrimitives(),
      saving: this.saving.getValue(),
    }
  }

  getId() {
    return this.id
  }
}
