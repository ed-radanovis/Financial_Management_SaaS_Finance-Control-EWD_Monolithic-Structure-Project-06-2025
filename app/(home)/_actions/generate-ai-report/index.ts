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

// example report if API is not configured
const DUMMY_REPORT = `...`;

type GenerateReportResult =
	| { success: true; report: string }
	| { success: false; error: string };

export const generateAiReport = async ({
	month,
	year,
}: GenerateAiReportSchema): Promise<GenerateReportResult> => {
	generateAiReportSchema.parse({ month, year });

	// AUTH to generate report
	const { userId } = await auth();
	if (!userId) {
		return { success: false, error: "Unauthorized" };
	}

	// check if the user has a premium plan
	const user = await clerkClient().users.getUser(userId);
	const hasPremiumPlan =
		user.publicMetadata.subscriptionPlan === "premium-mensal" ||
		user.publicMetadata.subscriptionPlan === "premium-semestral";

	if (!hasPremiumPlan) {
		return { success: false, error: "PREMIUM_PLAN_REQUIRED" };
	}

	if (!process.env.GEMINI_API_KEY) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return { success: true, report: DUMMY_REPORT };
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
		return { success: false, error: "NO_TRANSACTIONS_FOUND_FOR_MONTH" };
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

	const systemInstruction =
		"Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças.";

	const content = `Gere um relatório com insights sobre as minhas finanças. Abaixo estão as transações apresentadas como uma lista:

${listItems}

${financialSummary}

Inclua também uma análise das entradas, saídas, saldo e as categorias mais gastas, oferecendo insights financeiros personalizados.`;

	try {
		// call to Gemini API

		const response = await axios.post(
			// endpoit para openai
			// "https://generativelanguage.googleapis.com/v1beta/chat/completions",

			// endpoit para gemini
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
			{
				model: "gemini-2.5-flash",
				contents: [
					{
						role: "user",
						parts: [
							{
								text: `${systemInstruction}\n\n${content}`,
							},
						],
					},
				],
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return {
			success: true,
			report: response.data.candidates[0].content.parts[0].text,
		};
	} catch (error) {
		console.error("Erro ao gerar relatório com Gemini API:", error);
		return { success: false, error: "GEMINI_API_ERROR" };
	}
};
