import type { FixedExpense } from "../models/FixedExpense.ts";
import type { FixedExpenseId } from "../../../shared/domain/models/ids/FixedExpenseId.ts";

export interface FixedExpensesRepository {
    save(fixedExpense: FixedExpense): Promise<void>
    findOneById(id: FixedExpenseId): Promise<FixedExpense | undefined>
}