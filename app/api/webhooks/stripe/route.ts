// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import Queue from "bull";
// import { clerkClient } from "@clerk/nextjs/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// 	apiVersion: "2024-11-20.acacia",
// });

// const webhookQueue = new Queue("webhook-processing", process.env.REDIS_URL!, {
// 	redis: { tls: { rejectUnauthorized: false } },
// 	defaultJobOptions: {
// 		attempts: 3,
// 		backoff: {
// 			type: "exponential",
// 			delay: 1000,
// 		},
// 	},
// });

// // global state to track whether we are in fallback mode (without Redis)
// let isFallbackMode = false;
// // next month start date to reactivate Redis
// let nextMonthResetDate: Date | null = null;

// // process the webhook directly (without Redis)
// const processWebhookDirectly = async (event: Stripe.Event) => {
// 	switch (event.type) {
// 		case "invoice.paid": {
// 			const invoice = event.data.object as Stripe.Invoice;
// 			const subscriptionId = invoice.subscription as string | null;

// 			if (!subscriptionId) return;

// 			const customerId = invoice.customer as string;
// 			const subscription = await stripe.subscriptions.retrieve(subscriptionId);
// 			const clerkUserId = subscription.metadata.clerk_user_id;

// 			if (!clerkUserId)
// 				throw new Error("Clerk user ID not found in subscription metadata");

// 			const priceId = subscription.items.data[0].price.id;
// 			let planType = null;
// 			if (priceId === process.env.STRIPE_PREMIUM_PLAN_PRICE_ID) {
// 				planType = "premium-mensal";
// 			} else if (priceId === process.env.STRIPE_SEMESTRAL_PLAN_PRICE_ID) {
// 				planType = "premium-semestral";
// 			}

// 			await clerkClient.users.updateUser(clerkUserId, {
// 				privateMetadata: {
// 					stripeCustomerId: customerId,
// 					stripeSubscriptionId: subscriptionId,
// 				},
// 				publicMetadata: {
// 					subscriptionPlan: planType,
// 				},
// 			});
// 			break;
// 		}

// 		case "customer.subscription.deleted": {
// 			const subscription = event.data.object as Stripe.Subscription;
// 			const clerkUserId = subscription.metadata.clerk_user_id;

// 			if (!clerkUserId)
// 				throw new Error("Clerk user ID not found in subscription metadata");

// 			await clerkClient.users.updateUser(clerkUserId, {
// 				privateMetadata: {
// 					stripeCustomerId: null,
// 					stripeSubscriptionId: null,
// 				},
// 				publicMetadata: {
// 					subscriptionPlan: null,
// 				},
// 			});
// 			break;
// 		}
// 	}
// };

// export const POST = async (request: Request) => {
// 	if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
// 		return NextResponse.error();
// 	}

// 	const signature = request.headers.get("stripe-signature");
// 	if (!signature) {
// 		return NextResponse.error();
// 	}

// 	const text = await request.text();

// 	let event: Stripe.Event;
// 	try {
// 		event = stripe.webhooks.constructEvent(
// 			text,
// 			signature,
// 			process.env.STRIPE_WEBHOOK_SECRET,
// 		);
// 	} catch {
// 		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
// 	}

// 	// check if Redis can be reactivated
// 	if (isFallbackMode && nextMonthResetDate && new Date() >= nextMonthResetDate) {
// 		isFallbackMode = false;
// 		nextMonthResetDate = null;
// 	}

// 	// enqueue in Redis unless in fallback mode
// 	if (!isFallbackMode) {
// 		try {
// 			await webhookQueue.add({ event });
// 		} catch (error: unknown) {
// 			if (
// 				error instanceof Error &&
// 				error.message &&
// 				error.message.includes("max requests limit exceeded")
// 			) {
// 				isFallbackMode = true;
// 				const now = new Date();
// 				nextMonthResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
// 				await processWebhookDirectly(event);
// 			} else {
// 				return NextResponse.json(
// 					{ error: "Failed to queue event" },
// 					{ status: 500 },
// 				);
// 			}
// 		}
// 	} else {
// 		// fallback mode: process without Redis
// 		await processWebhookDirectly(event);
// 	}

// 	return NextResponse.json({ received: true });
// };

// // process up to 5 jobs simultaneously
// webhookQueue.process(5, async (job) => {
// 	const { event } = job.data;

// 	switch (event.type) {
// 		case "invoice.paid": {
// 			const invoice = event.data.object as Stripe.Invoice;
// 			const subscriptionId = invoice.subscription as string | null; // allow null

// 			if (!subscriptionId) {
// 				return;
// 			}

// 			const customerId = invoice.customer as string;

// 			// get subscription details
// 			const subscription = await stripe.subscriptions.retrieve(subscriptionId);
// 			const clerkUserId = subscription.metadata.clerk_user_id;

// 			if (!clerkUserId) {
// 				throw new Error("Clerk user ID not found in subscription metadata");
// 			}

// 			// get the price ID used in the subscription
// 			const priceId = subscription.items.data[0].price.id;

// 			// determines the plan based on the Price ID
// 			let planType = null;
// 			if (priceId === process.env.STRIPE_PREMIUM_PLAN_PRICE_ID) {
// 				planType = "premium-mensal";
// 			} else if (priceId === process.env.STRIPE_SEMESTRAL_PLAN_PRICE_ID) {
// 				planType = "premium-semestral";
// 			}

// 			// update user in Clerk
// 			await clerkClient.users.updateUser(clerkUserId, {
// 				privateMetadata: {
// 					stripeCustomerId: customerId,
// 					stripeSubscriptionId: subscriptionId,
// 				},
// 				publicMetadata: {
// 					subscriptionPlan: planType,
// 				},
// 			});
// 			break;
// 		}

// 		case "customer.subscription.deleted": {
// 			const subscription = event.data.object as Stripe.Subscription;
// 			const clerkUserId = subscription.metadata.clerk_user_id;

// 			if (!clerkUserId) {
// 				throw new Error("Clerk user ID not found in subscription metadata");
// 			}

// 			await clerkClient.users.updateUser(clerkUserId, {
// 				privateMetadata: {
// 					stripeCustomerId: null,
// 					stripeSubscriptionId: null,
// 				},
// 				publicMetadata: {
// 					subscriptionPlan: null,
// 				},
// 			});
// 			break;
// 		}
// 	}
// });

import { NextResponse } from "next/server";
import Stripe from "stripe";
import Queue from "bull";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2024-11-20.acacia",
});

const webhookQueue = new Queue("webhook-processing", process.env.REDIS_URL!, {
	redis: { tls: { rejectUnauthorized: false } },
	defaultJobOptions: {
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 1000,
		},
	},
});

// global state to track whether we are in fallback mode (without Redis)
let isFallbackMode = false;
// next month start date to reactivate Redis
let nextMonthResetDate: Date | null = null;

// process the webhook directly (without Redis)
const processWebhookDirectly = async (event: Stripe.Event) => {
	switch (event.type) {
		case "invoice.paid": {
			const invoice = event.data.object as Stripe.Invoice;
			const subscriptionId = invoice.subscription as string | null;

			if (!subscriptionId) return;

			const customerId = invoice.customer as string;
			const subscription = await stripe.subscriptions.retrieve(subscriptionId);
			const clerkUserId = subscription.metadata.clerk_user_id;

			if (!clerkUserId)
				throw new Error("Clerk user ID not found in subscription metadata");

			const priceId = subscription.items.data[0].price.id;
			let planType = null;
			if (priceId === process.env.STRIPE_PREMIUM_PLAN_PRICE_ID) {
				planType = "premium-mensal";
			} else if (priceId === process.env.STRIPE_SEMESTRAL_PLAN_PRICE_ID) {
				planType = "premium-semestral";
			}

			await clerkClient.users.updateUser(clerkUserId, {
				privateMetadata: {
					stripeCustomerId: customerId,
					stripeSubscriptionId: subscriptionId,
				},
				publicMetadata: {
					subscriptionPlan: planType,
				},
			});
			break;
		}

		case "customer.subscription.deleted": {
			const subscription = event.data.object as Stripe.Subscription;
			const clerkUserId = subscription.metadata.clerk_user_id;

			if (!clerkUserId)
				throw new Error("Clerk user ID not found in subscription metadata");

			await clerkClient.users.updateUser(clerkUserId, {
				privateMetadata: {
					stripeCustomerId: null,
					stripeSubscriptionId: null,
				},
				publicMetadata: {
					subscriptionPlan: null,
				},
			});
			break;
		}

		case "payment_intent.succeeded": {
			console.log("Payment intent succeeded:", event.data.object);
			// Adicione lógica específica aqui se necessário (ex.: registrar transação)
			break;
		}
	}
};

export const POST = async (request: Request) => {
	if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
		return NextResponse.error();
	}

	const signature = request.headers.get("stripe-signature");
	if (!signature) {
		return NextResponse.error();
	}

	const text = await request.text();

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(
			text,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET,
		);
	} catch {
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	// check if Redis can be reactivated
	if (isFallbackMode && nextMonthResetDate && new Date() >= nextMonthResetDate) {
		isFallbackMode = false;
		nextMonthResetDate = null;
	}

	// enqueue in Redis unless in fallback mode
	if (!isFallbackMode) {
		try {
			await webhookQueue.add({ event });
		} catch (error: unknown) {
			if (
				error instanceof Error &&
				error.message &&
				error.message.includes("max requests limit exceeded")
			) {
				isFallbackMode = true;
				const now = new Date();
				nextMonthResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
				await processWebhookDirectly(event);
			} else {
				return NextResponse.json(
					{ error: "Failed to queue event" },
					{ status: 500 },
				);
			}
		}
	} else {
		// fallback mode: process without Redis
		await processWebhookDirectly(event);
	}

	return NextResponse.json({ received: true });
};

// process up to 5 jobs simultaneously
webhookQueue.process(5, async (job) => {
	const { event } = job.data;

	switch (event.type) {
		case "invoice.paid": {
			const invoice = event.data.object as Stripe.Invoice;
			const subscriptionId = invoice.subscription as string | null; // allow null

			if (!subscriptionId) {
				return;
			}

			const customerId = invoice.customer as string;

			// get subscription details
			const subscription = await stripe.subscriptions.retrieve(subscriptionId);
			const clerkUserId = subscription.metadata.clerk_user_id;

			if (!clerkUserId) {
				throw new Error("Clerk user ID not found in subscription metadata");
			}

			// get the price ID used in the subscription
			const priceId = subscription.items.data[0].price.id;

			// determines the plan based on the Price ID
			let planType = null;
			if (priceId === process.env.STRIPE_PREMIUM_PLAN_PRICE_ID) {
				planType = "premium-mensal";
			} else if (priceId === process.env.STRIPE_SEMESTRAL_PLAN_PRICE_ID) {
				planType = "premium-semestral";
			}

			// update user in Clerk
			await clerkClient.users.updateUser(clerkUserId, {
				privateMetadata: {
					stripeCustomerId: customerId,
					stripeSubscriptionId: subscriptionId,
				},
				publicMetadata: {
					subscriptionPlan: planType,
				},
			});
			break;
		}

		case "customer.subscription.deleted": {
			const subscription = event.data.object as Stripe.Subscription;
			const clerkUserId = subscription.metadata.clerk_user_id;

			if (!clerkUserId) {
				throw new Error("Clerk user ID not found in subscription metadata");
			}

			await clerkClient.users.updateUser(clerkUserId, {
				privateMetadata: {
					stripeCustomerId: null,
					stripeSubscriptionId: null,
				},
				publicMetadata: {
					subscriptionPlan: null,
				},
			});
			break;
		}

		case "payment_intent.succeeded": {
			console.log("Payment intent succeeded:", event.data.object);
			// Adicione lógica específica aqui se necessário (ex.: registrar transação)
			break;
		}
	}
});
