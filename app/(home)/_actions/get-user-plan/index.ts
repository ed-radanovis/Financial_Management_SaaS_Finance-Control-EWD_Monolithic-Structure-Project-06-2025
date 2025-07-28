"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";

export const getUserPlan = async () => {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthorized");
	}

	const user = await clerkClient().users.getUser(userId);
	const plan = user.publicMetadata.subscriptionPlan;

	return plan === "premium-mensal" || plan === "premium-semestral";
};
