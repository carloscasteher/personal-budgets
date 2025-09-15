import { DomainError } from "../../../shared/domain/errors/DomainError.ts";
import { DomainErrorCode } from "../../../shared/domain/errors/DomainErrorCode.ts";
import type { EmailAddress } from "../../../shared/domain/models/EmailAddress.ts";

export class UserNotFoundError extends DomainError {
    constructor(email?: EmailAddress) {
      super(`User ${email ? `with email: ${email.toString()}` : ''} not found`, DomainErrorCode.USER_NOT_FOUND)
    }
  }