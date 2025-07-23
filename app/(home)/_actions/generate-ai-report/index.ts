"use server";

import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import axios from "axios";
import { GenerateAiReportSchema, generateAiReportSchema } from "./schema";
import {
	TRANSACTION_CATEGORY_LABELS,
	TRANSACTION_PAYMENT_METHOD_LABELS,
	TRANSACTION_TYPE_OPTIONS,
	TRANSACTION_SUBCATEGORY_LABELS,
} from "@/app/_constants/transactions";
import { TransactionType } from "@prisma/client";

class NoTransactionsError extends Error {
	constructor(message = "No transactions found for the specified month.") {
		super(message);
		this.name = "NoTransactionsError";
	}
}

// example report if API is not configured
const DUMMY_REPORT = `...`;

export const generateAiReport = async ({
	month,
	year,
}: GenerateAiReportSchema) => {
	generateAiReportSchema.parse({ month, year });

	// AUTH to generate report
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthorized");
	}

	// check if the user has a premium plan
	const user = await clerkClient.users.getUser(userId);
	const hasPremiumPlan =
		user.publicMetadata.subscriptionPlan === "premium-mensal" ||
		user.publicMetadata.subscriptionPlan === "premium-semestral";

	if (!hasPremiumPlan) {
		throw new Error("You need a premium plan to generate AI reports");
	}

	if (!process.env.GEMINI_API_KEY) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return DUMMY_REPORT; // Returns static report
	}

	// get transactions for the month and year
	const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
	const endDate = new Date(parseInt(year), parseInt(month), 0);

	const transactions = await db.transaction.findMany({
		where: {
			userId: userId,
			date: {
				gte: startDate,
				lte: endDate,
			},
		},
	});

	if (transactions.length === 0) {
		throw new NoTransactionsError();
	}

	// sum up inflows (Deposits + Investments) and outflows (Expenses)
	let totalDeposits: number = 0;
	let totalInvestments: number = 0;
	let totalExpenses: number = 0;
	const listItems = transactions
		.map((transaction) => {
			// categorize entries and expenses
			if (transaction.type === TransactionType.DEPOSIT) {
				totalDeposits += transaction.amount.toNumber();
			} else if (transaction.type === TransactionType.INVESTMENT) {
				totalInvestments += transaction.amount.toNumber();
			} else if (transaction.type === TransactionType.EXPENSE) {
				totalExpenses += transaction.amount.toNumber();
			}

			// generate transaction items with subcategory if available
			const subcategoryLabel =
				transaction.subcategory &&
				TRANSACTION_SUBCATEGORY_LABELS[transaction.subcategory]
					? `, **Subcategoria:** ${TRANSACTION_SUBCATEGORY_LABELS[transaction.subcategory]}`
					: "";
			return (
				`- **Data:** ${transaction.date.toLocaleDateString("pt-BR")}, ` +
				`**Tipo:** ${
					TRANSACTION_TYPE_OPTIONS.find(
						(option) => option.value === transaction.type,
					)?.label
				}, ` +
				`**Valor:** R$ ${transaction.amount.toFixed(2).replace(".", ",")}, ` +
				`**Categoria:** ${TRANSACTION_CATEGORY_LABELS[transaction.category]}, ` +
				`**Método de Pagamento:** ${
					TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]
				}` +
				subcategoryLabel
			);
		})
		.join("\n");

	// calculate total and final balance
	const totalEntradas = totalDeposits + totalInvestments;
	const totalSaidas = totalExpenses;
	const saldoFinal = totalEntradas - totalSaidas;

	// generate financial summary
	const financialSummary = `
### Sumário Financeiro:

  - **Entradas:**
  - Depósitos: R$ ${totalDeposits.toFixed(2).replace(".", ",")}
  - Investimentos: R$ ${totalInvestments.toFixed(2).replace(".", ",")}
    - **Total Entradas:** R$ ${totalEntradas.toFixed(2).replace(".", ",")}

  - **Saídas:**
  - Despesas: R$ ${totalExpenses.toFixed(2).replace(".", ",")}
    - **Total Saídas:** R$ ${totalSaidas.toFixed(2).replace(".", ",")}

  - **Saldo Final:** R$ ${saldoFinal.toFixed(2).replace(".", ",")}
`;

	const content = `Gere um relatório com insights sobre as minhas finanças. Abaixo estão as transações apresentadas como uma lista:

${listItems}

${financialSummary}

Inclua também uma análise das entradas, saídas, saldo e as categorias mais gastas, oferecendo insights financeiros personalizados.`;

	try {
		// call to Gemini API
		const response = await axios.post(
			"https://generativelanguage.googleapis.com/v1beta/chat/completions",
			{
				model: "gemini-1.5-flash",
				messages: [
					{
						role: "system",
						content:
							"Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças.",
					},
					{
						role: "user",
						content,
					},
				],
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
				},
			},
		);
		return response.data.choices[0].message.content;
	} catch (error) {
		if (error instanceof NoTransactionsError) {
			throw error;
		} else {
			console.error("Erro ao gerar relatório. Tente novamente mais tarde:", error);
			throw new Error("Erro ao gerar relatório. Tente novamente mais tarde.");
		}
	}
};
