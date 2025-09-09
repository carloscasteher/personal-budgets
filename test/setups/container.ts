import { BudgetsRepositoryMemory } from '../../src/budgets/infrastructure/repositories/BudgetsRepositoryMemory.ts'
import { FixedExpensesRepositoryMemory } from '../../src/budgets/infrastructure/repositories/FixedExpensesRepositoryMemory.ts'
import { LoggerDummy } from '../../src/shared/infrastructure/services/logger/LoggerDummy.ts'
import { Token } from '../../src/shared/domain/services/Token.ts'
import { UsersRepositoryMemory } from '../../src/users/infrastructure/repositories/UsersRepositoryMemory.ts'
import { config } from '../../src/shared/infrastructure/config.ts'
import { container as prodContainer } from '../../src/container.ts'
import { testMongoOptions } from '../config/testMongoOptions.ts'

prodContainer.rebind(Token.DB_CONFIG).toConstantValue(testMongoOptions)
prodContainer.rebind(Token.LOGGER).toConstantValue(new LoggerDummy())

if (!config.forceEnableORMRepositories) {
  prodContainer.rebind(Token.BUDGETS_REPOSITORY).toDynamicValue(BudgetsRepositoryMemory.create)
  prodContainer.rebind(Token.USERS_REPOSITORY).toDynamicValue(UsersRepositoryMemory.create)
  prodContainer
    .rebind(Token.FIXED_EXPENSES_REPOSITORY)
    .toDynamicValue(FixedExpensesRepositoryMemory.create)
}

export const container = prodContainer
