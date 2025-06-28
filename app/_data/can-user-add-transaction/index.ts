import { auth, clerkClient } from "@clerk/nextjs/server";
import { getCurrentMonthTransactions } from "../get-current-month-transactions";

export const canUserAddTransaction = async () => {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthorized");
	}

	try {
		const user = await clerkClient().users.getUser(userId);
		const userPlan = user.publicMetadata.subscriptionPlan;
		if (userPlan === "premium-mensal" || userPlan === "premium-semestral") {
			return true;
		}
		const currentMonthTransactions = await getCurrentMonthTransactions();
		if (currentMonthTransactions >= 12) {
			return false;
		}
		return true;

		// fallback: do not add transaction in case of error
	} catch (error) {
		console.error("Erro ao verificar plano do usuário:", error);
		return false;
	}
};
