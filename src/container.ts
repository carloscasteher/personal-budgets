import { BindingScopeEnum, Container } from 'inversify'

import { BudgetsRepositoryMongo } from './budgets/infrastructure/repositories/BudgetsRepositoryMongo.ts'
import { ClockDate } from './shared/infrastructure/services/clock/ClockDate.ts'
import { CreateBudget } from './budgets/use-cases/CreateBudget.ts'
import { CreateBudgetEndpoint } from './budgets/infrastructure/controllers/CreateBudgetEndpoint.ts'
import { CryptoNode } from './shared/infrastructure/services/crypto/CryptoNode.ts'
import { FixedExpensesRepositoryMongo } from './budgets/infrastructure/repositories/FixedExpensesRepositoryMongo.ts'
import { GetBudget } from './budgets/use-cases/GetBudget.ts'
import { GetBudgetEndpoint } from './budgets/infrastructure/controllers/GetBudgetEndpoint.ts'
import { GetBudgets } from './budgets/use-cases/GetBudgets.ts'
import { GetBudgetsEndpoint } from './budgets/infrastructure/controllers/GetBudgetsEndpoint.ts'
import { JwtDecoderHono } from './shared/infrastructure/services/jwt/JwtDecoderHono.ts'
import { JwtSignerHono } from './shared/infrastructure/services/jwt/JwtSignerHono.ts'
import { LoggerPino } from './shared/infrastructure/services/logger/LoggerPino.ts'
import { LoginUser } from './users/use-cases/LoginUser.ts'
import { LoginUserEndpoint } from './users/infrastructure/controllers/LoginUserEndpoint.ts'
import { RegisterUser } from './users/use-cases/RegisterUser.ts'
import { RegisterUserEndpoint } from './users/infrastructure/controllers/RegisterUserEndpoint.ts'
import { RequestContext } from './shared/infrastructure/controllers/middlewares/RequestContext.ts'
import { Token } from './shared/domain/services/Token.ts'
import { UsersRepositoryMongo } from './users/infrastructure/repositories/UsersRepositoryMongo.ts'
import { createHono } from './shared/infrastructure/controllers/CreateHono.ts'
import { mongoModule } from './shared/infrastructure/repositories/CreateMongoClient.ts'

export const container = new Container({ defaultScope: BindingScopeEnum.Singleton })

// Use cases
container.bind(CreateBudget).toDynamicValue(CreateBudget.create)
container.bind(GetBudgets).toDynamicValue(GetBudgets.create)
container.bind(GetBudget).toDynamicValue(GetBudget.create)
container.bind(RegisterUser).toDynamicValue(RegisterUser.create)
container.bind(LoginUser).toDynamicValue(LoginUser.create)

// Controllers
container.bind(Token.ENDPOINT).toConstantValue(CreateBudgetEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(GetBudgetsEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(GetBudgetEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(RegisterUserEndpoint)
container.bind(Token.ENDPOINT).toConstantValue(LoginUserEndpoint)

// Repositories
container.bind(Token.BUDGETS_REPOSITORY).toDynamicValue(BudgetsRepositoryMongo.create)
container.bind(Token.FIXED_EXPENSES_REPOSITORY).toDynamicValue(FixedExpensesRepositoryMongo.create)
container.bind(Token.USERS_REPOSITORY).toDynamicValue(UsersRepositoryMongo.create)

// Services
container.bind(Token.LOGGER).toDynamicValue(LoggerPino.create)
container.bind(Token.JWT_SIGNER).toConstantValue(new JwtSignerHono())
container.bind(Token.JWT_DECODER).toConstantValue(new JwtDecoderHono())
container.bind(Token.CRYPTO).toConstantValue(new CryptoNode())
container.bind(Token.CLOCK).toConstantValue(new ClockDate())

// Libraries
container.load(mongoModule)

// Hono
container.bind(Token.APP).toDynamicValue(createHono)
container.bind(RequestContext).toConstantValue(new RequestContext())
