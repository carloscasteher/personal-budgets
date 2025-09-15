import { DomainError } from "../../../shared/domain/errors/DomainError.ts";
import { DomainErrorCode } from "../../../shared/domain/errors/DomainErrorCode.ts";
import type { EmailAddress } from "../../../shared/domain/models/EmailAddress.ts";

export class UserWithEmailAlreadyExistsError extends DomainError {
    constructor(email: EmailAddress) {
      super(`User with email: ${email.toString()} already exists`, DomainErrorCode.USER_WITH_EMAIL_ALREADY_EXISTS)
    }
  }