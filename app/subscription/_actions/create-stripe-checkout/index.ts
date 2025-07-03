"use server";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const createStripeCheckout = async (
	planType: "mensal" | "semestral",
) => {
	// AUTH to access
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthorized");
	}
	if (!process.env.STRIPE_SECRET_KEY) {
		throw new Error("Stripe secret key not found");
	}

	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
		apiVersion: "2024-11-20.acacia",
	});

	// select value based on plan
	const priceId =
		planType === "mensal"
			? process.env.STRIPE_PREMIUM_PLAN_PRICE_ID
			: process.env.STRIPE_SEMESTRAL_PLAN_PRICE_ID;

	if (!priceId) {
		throw new Error("Price ID not found for selected plan");
	}

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		mode: "subscription",
		// success_url: `${process.env.APP_URL}/agradecimento`,
		// cancel_url: `${process.env.APP_URL}/ cancelamento motivo`,  ver possibilidade / viabilidade de ser feito
		success_url: process.env.APP_URL,
		cancel_url: process.env.APP_URL,
		subscription_data: {
			metadata: {
				clerk_user_id: userId,
				plan_type: planType,
			},
		},
		line_items: [
			{
				price: priceId,
				quantity: 1,
			},
		],
	});

	return { sessionId: session.id };
};
