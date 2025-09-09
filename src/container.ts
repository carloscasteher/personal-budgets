import { BindingScopeEnum, Container } from 'inversify'

import { BudgetsRepositoryMongo } from './budgets/infrastructure/repositories/BudgetsRepositoryMongo.ts'
import { CreateBudget } from './budgets/use-cases/CreateBudget.ts'
import { CreateBudgetEndpoint } from './budgets/infrastructure/controllers/CreateBudgetEndpoint.ts'
import { FixedExpensesRepositoryMongo } from './budgets/infrastructure/repositories/FixedExpensesRepositoryMongo.ts'
import { JwtSignerHono } from './shared/infrastructure/services/jwt/JwtSignerHono.ts'
import { LoggerPino } from './shared/infrastructure/services/logger/LoggerPino.ts'
import { RequestContext } from './shared/infrastructure/controllers/middlewares/RequestContext.ts'
import { Token } from './shared/domain/services/Token.ts'
import { createHono } from './shared/infrastructure/controllers/CreateHono.ts'
import { mongoModule } from './shared/infrastructure/repositories/CreateMongoClient.ts'

export const container = new Container({ defaultScope: BindingScopeEnum.Singleton })

// Use cases
container.bind(CreateBudget).toDynamicValue(CreateBudget.create)

// Controllers
container.bind(Token.ENDPOINT).toConstantValue(CreateBudgetEndpoint)

// Repositories
container.bind(Token.BUDGETS_REPOSITORY).toDynamicValue(BudgetsRepositoryMongo.create)
container.bind(Token.FIXED_EXPENSES_REPOSITORY).toDynamicValue(FixedExpensesRepositoryMongo.create)

// Services
container.bind(Token.LOGGER).toDynamicValue(LoggerPino.create)
container.bind(Token.JWT_SIGNER).toConstantValue(new JwtSignerHono())

// Libraries
container.load(mongoModule)

// Hono
container.bind(Token.APP).toDynamicValue(createHono)
container.bind(RequestContext).toConstantValue(new RequestContext())
