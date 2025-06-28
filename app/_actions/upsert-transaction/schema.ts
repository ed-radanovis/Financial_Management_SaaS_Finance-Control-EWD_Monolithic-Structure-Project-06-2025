import {
	TransactionCategory,
	TransactionPaymentMethod,
	TransactionType,
	TransactionSubcategory,
} from "@prisma/client";
import { z } from "zod";

export const upsertTransactionSchema = z.object({
	name: z.string().trim().min(1),
	amount: z.number().positive(),
	type: z.nativeEnum(TransactionType),
	category: z.nativeEnum(TransactionCategory),
	subcategory: z.nativeEnum(TransactionSubcategory).optional(),
	paymentMethod: z.nativeEnum(TransactionPaymentMethod),
	date: z.date(),
});
