import type { FixedExpense } from "../models/FixedExpense.ts";

export interface FixedExpensesRepository {
    save(fixedExpense: FixedExpense): Promise<void>
}