import { BudgetsRepositoryMemory } from '../../src/budgets/infrastructure/repositories/BudgetsRepositoryMemory.ts'
import { LoggerDummy } from '../../src/shared/infrastructure/services/logger/LoggerDummy.ts'
import { Token } from '../../src/shared/domain/services/Token.ts'
import { config } from '../../src/shared/infrastructure/config.ts'
import { container as prodContainer } from '../../src/container.ts'
import { testMongoOptions } from '../config/testMongoOptions.ts'

prodContainer.rebind(Token.DB_CONFIG).toConstantValue(testMongoOptions)
prodContainer.rebind(Token.LOGGER).toConstantValue(new LoggerDummy())

if (!config.forceEnableORMRepositories) {
  prodContainer.rebind(Token.BUDGETS_REPOSITORY).toDynamicValue(BudgetsRepositoryMemory.create)
}

export const container = prodContainer
