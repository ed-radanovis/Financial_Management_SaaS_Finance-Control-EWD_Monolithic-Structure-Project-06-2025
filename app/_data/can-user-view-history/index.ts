import { auth, clerkClient } from "@clerk/nextjs/server";

//check the allowed range for viewing history.
export const canUserViewHistory = async (): Promise<{
	startDate: string;
	endDate: string;
} | null> => {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthorized");
	}

	const user = await clerkClient.users.getUser(userId);

	const userPlan = user.publicMetadata.subscriptionPlan;
	if (userPlan === "premium-mensal" || userPlan === "premium-semestral") {
		return null;
	}
	// get the first login date
	const firstLoginDate = new Date(user.createdAt);
	// calculate the start of the period
	const startDate = new Date(
		firstLoginDate.getFullYear(),
		firstLoginDate.getMonth(),
		1,
	);
	// calculate the end of the allowed period
	const endDate = new Date(
		firstLoginDate.getFullYear(),
		firstLoginDate.getMonth() + 1,
		0,
	);
	// ensures that the time is set to the beginning of the day
	startDate.setHours(0, 0, 0, 0);
	endDate.setHours(23, 59, 59, 999);

	return {
		startDate: startDate.toISOString().split("T")[0],
		endDate: endDate.toISOString().split("T")[0],
	};
};
