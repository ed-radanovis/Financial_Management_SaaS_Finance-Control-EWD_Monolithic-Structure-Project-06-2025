import { db } from "@/app/_lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { endOfMonth, startOfMonth } from "date-fns";

export const getCurrentMonthTransactions = async () => {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthorized");
	}

	const now = new Date();
	const startDate = startOfMonth(now);
	const endDate = endOfMonth(now);

	endDate.setHours(23, 59, 59, 999);

	return db.transaction.count({
		where: {
			userId,
			createdAt: {
				gte: startDate,
				lte: endDate,
			},
		},
	});
};
