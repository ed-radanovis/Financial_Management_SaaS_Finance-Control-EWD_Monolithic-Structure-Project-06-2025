import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { auth } from "@clerk/nextjs/server";
import { endOfMonth, parse } from "date-fns";

export const getDashboard = async (month: string, year: string) => {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthorized");
	}

	const baseDate = parse(`${year}-${month}-01`, "yyyy-MM-dd", new Date());
	const startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
	const endDate = endOfMonth(baseDate);

	startDate.setHours(0, 0, 0, 0);
	endDate.setHours(23, 59, 59, 999);

	const where = {
		userId,
		date: {
			gte: startDate,
			lte: endDate,
		},
	};

	const getAggregateTotal = async (type: TransactionType) => {
		const result = await db.transaction.aggregate({
			where: { ...where, type },
			_sum: { amount: true },
		});
		return Number(result._sum.amount ?? 0);
	};

	const [depositsTotal, investmentsTotal, expensesTotal] = await Promise.all([
		getAggregateTotal(TransactionType.DEPOSIT),
		getAggregateTotal(TransactionType.INVESTMENT),
		getAggregateTotal(TransactionType.EXPENSE),
	]);

	const balance = depositsTotal - investmentsTotal - expensesTotal;

	const transactionsTotalResult = await db.transaction.aggregate({
		where,
		_sum: { amount: true },
	});
	const transactionsTotal = Number(transactionsTotalResult._sum.amount ?? 0);

	const calculatePercentage = (amount: number) =>
		transactionsTotal > 0 ? Math.round((amount / transactionsTotal) * 100) : 0;

	const typesPercentage: TransactionPercentagePerType = {
		[TransactionType.DEPOSIT]: calculatePercentage(depositsTotal),
		[TransactionType.EXPENSE]: calculatePercentage(expensesTotal),
		[TransactionType.INVESTMENT]: calculatePercentage(investmentsTotal),
	};

	const categoryData = await db.transaction.groupBy({
		by: ["category"],
		where: { ...where, type: TransactionType.EXPENSE },
		_sum: { amount: true },
	});

	const subcategoryData = await db.transaction.groupBy({
		by: ["category", "subcategory"],
		where: { ...where, type: TransactionType.EXPENSE },
		_sum: { amount: true },
	});

	const totalExpensePerCategory: TotalExpensePerCategory[] = categoryData.map(
		(cat) => {
			const subcategories = subcategoryData
				.filter((sub) => sub.category === cat.category)
				.map((sub) => ({
					subcategory: sub.subcategory,
					totalAmount: Number(sub._sum.amount ?? 0),
					percentageOfTotal:
						expensesTotal > 0
							? Math.round((Number(sub._sum.amount ?? 0) / expensesTotal) * 100)
							: 0,
				}));
			return {
				category: cat.category,
				totalAmount: Number(cat._sum.amount ?? 0),
				percentageOfTotal:
					expensesTotal > 0
						? Math.round((Number(cat._sum.amount ?? 0) / expensesTotal) * 100)
						: 0,
				subcategories,
			};
		},
	);

	const lastTransactions = await db.transaction.findMany({
		where,
		orderBy: { date: "desc" },
		take: 15,
	});

	return {
		depositsTotal,
		investmentsTotal,
		expensesTotal,
		balance,
		typesPercentage,
		totalExpensePerCategory,
		lastTransactions: JSON.parse(JSON.stringify(lastTransactions)),
	};
};
