import type { FixedExpense } from "../models/FixedExpense.ts";
import type { FixedExpenseId } from "../../../shared/domain/models/ids/FixedExpenseId.ts";
import type { Month } from "../models/Month.ts";
import type { UserId } from "../../../shared/domain/models/ids/UserId.ts";
import type { Year } from "../models/Year.ts";

export interface FixedExpensesRepository {
    save(fixedExpense: FixedExpense): Promise<void>
    findOneById(id: FixedExpenseId): Promise<FixedExpense | undefined>
    findAllActivesByUserId(userId: UserId, month: Month, year: Year): Promise<FixedExpense[]>
}