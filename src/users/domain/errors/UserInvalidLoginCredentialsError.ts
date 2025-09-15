import { DomainError } from "../../../shared/domain/errors/DomainError.ts";
import { DomainErrorCode } from "../../../shared/domain/errors/DomainErrorCode.ts";

export class UserInvalidLoginCredentialsError extends DomainError {
    constructor() {
      super('Invalid user credentials', DomainErrorCode.USER_INVALID_LOGIN_CREDENTIALS)
    }
  }