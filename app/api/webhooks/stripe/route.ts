import { headers } from "next/headers";
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
const processStripeEvent = async (event: Stripe.Event) => {
	try {
		switch (event.type) {
			case "invoice.paid": {
				const invoice = event.data.object as Stripe.Invoice;
				const subscriptionId = invoice.subscription as string | null;

				if (!subscriptionId) {
					console.warn("Event invoice.paid without subscriptionId. Ignoring.");
					return;
				}

				const customerId = invoice.customer as string;
				const subscription = await stripe.subscriptions.retrieve(subscriptionId);
				const clerkUserId = subscription.metadata.clerk_user_id;

				if (!clerkUserId)
					throw new Error(
						"Clerk user ID not found in subscription metadata for invoice.paid",
					);

				const priceId = subscription.items.data[0].price.id;
				let planType: string | null = null;
				if (priceId === process.env.STRIPE_PREMIUM_PLAN_PRICE_ID) {
					planType = "premium-mensal";
				} else if (priceId === process.env.STRIPE_SEMESTRAL_PLAN_PRICE_ID) {
					planType = "premium-semestral";
				}

				await clerkClient().users.updateUser(clerkUserId, {
					privateMetadata: {
						stripeCustomerId: customerId,
						stripeSubscriptionId: subscriptionId,
					},
					publicMetadata: {
						subscriptionPlan: planType,
					},
				});
				console.log(
					`[Webhook] User ${clerkUserId} updated to ${planType} via invoice.paid (CLERK ONLY).`,
				);
				break;
			}

			case "customer.subscription.deleted": {
				const subscription = event.data.object as Stripe.Subscription;
				const clerkUserId = subscription.metadata.clerk_user_id;

				if (!clerkUserId)
					throw new Error(
						"Clerk user ID not found in subscription metadata for customer.subscription.deleted",
					);

				await clerkClient().users.updateUser(clerkUserId, {
					privateMetadata: {
						stripeCustomerId: null,
						stripeSubscriptionId: null,
					},
					publicMetadata: {
						subscriptionPlan: null,
					},
				});
				console.log(
					`[Webhook] User subscription ${clerkUserId} deleted (CLERK ONLY).`,
				);
				break;
			}

			case "checkout.session.completed": {
				const checkoutSession = event.data.object as Stripe.Checkout.Session;
				console.log("Checkout Session Completed:", checkoutSession.id);

				const customerId = checkoutSession.customer as string;
				const subscriptionId = checkoutSession.subscription as string | null;
				const userId = checkoutSession.metadata?.clerk_user_id;

				if (!userId) {
					console.error("userId not found in checkout session metadata.");
					throw new Error(
						"Missing userId in metadata from checkout.session.completed",
					);
				}

				let planType: string | null = null;
				if (
					checkoutSession.metadata?.price_id ===
					process.env.STRIPE_PREMIUM_PLAN_PRICE_ID
				) {
					planType = "premium-mensal";
				} else if (
					checkoutSession.metadata?.price_id ===
					process.env.STRIPE_SEMESTRAL_PLAN_PRICE_ID
				) {
					planType = "premium-semestral";
				}

				await clerkClient().users.updateUser(userId, {
					privateMetadata: {
						stripeCustomerId: customerId,
						stripeSubscriptionId: subscriptionId,
					},
					publicMetadata: {
						subscriptionPlan: planType,
					},
				});

				console.log(
					`[Webhook] User ${userId} updated with customer ID and plan ${planType} via checkout.session.completed (CLERK ONLY).`,
				);
				break;
			}

			default:
				console.log(`[Webhook] Unhandled Stripe event: ${event.type}`);
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`[Webhook] Error processing event ${event.type}:`, error);
		} else {
			console.error(
				`[Webhook] Unknown error processing event ${event.type}:`,
				error,
			);
		}
		throw error;
	}
};

// process up to 5 jobs simultaneously
webhookQueue.process(5, async (job) => {
	const { event } = job.data;
	console.log(`[Bull Queue] Processing event: ${event.type}`);
	await processStripeEvent(event);
});

export const POST = async (request: Request) => {
	if (
		!process.env.STRIPE_SECRET_KEY ||
		!process.env.STRIPE_WEBHOOK_SECRET ||
		!process.env.REDIS_URL
	) {
		console.error("Stripe/Redis environment variables missing.");
		return new NextResponse("Server configuration error", { status: 500 });
	}

	const stripeSignature = headers().get("stripe-signature");
	if (!stripeSignature) {
		console.warn("No Stripe signature found.");
		return new NextResponse("No Stripe signature found", {
			status: 400,
		});
	}

	const text = await request.text();
	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			text,
			stripeSignature,
			process.env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error(`Webhook Error: Invalid signature - ${err.message}`);
			return new NextResponse(
				`Webhook Error: Invalid signature - ${err.message}`,
				{ status: 400 },
			);
		}
		console.error(`Webhook Error: Unknown error - ${err}`);
		return new NextResponse(`Webhook Error: Unknown error`, { status: 400 });
	}

	// check if Redis can be reactivated
	if (isFallbackMode && nextMonthResetDate && new Date() >= nextMonthResetDate) {
		isFallbackMode = false;
		nextMonthResetDate = null;
		console.log("[Webhook] Fallback mode deactivated. Retrying Redis.");
	}

	// enqueue in Redis unless in fallback mode
	if (!isFallbackMode) {
		try {
			await webhookQueue.add({ event });
			console.log(`[Webhook] Event ${event.type} enqueued.`);
		} catch (error: unknown) {
			if (
				error instanceof Error &&
				error.message.includes("max requests limit exceeded")
			) {
				isFallbackMode = true;
				const now = new Date();
				nextMonthResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
				console.warn(
					`[Webhook] Redis request limit exceeded. Activating fallback mode. Processing event ${event.type} directly.`,
				);
				await processStripeEvent(event);
			} else if (error instanceof Error) {
				console.error(`[Webhook] Error enqueuing event ${event.type}:`, error);
				return new NextResponse(
					`Internal error enqueuing event: ${error.message}`,
					{ status: 500 },
				);
			} else {
				console.error(
					`[Webhook] Unknown error enqueuing event ${event.type}:`,
					error,
				);
				return new NextResponse(`Unknown internal error enqueuing event`, {
					status: 500,
				});
			}
		}
	} else {
		// fallback mode: process without Redis
		console.log(
			`[Webhook] Processing event ${event.type} directly (fallback mode).`,
		);
		try {
			await processStripeEvent(event);
		} catch (processingError: unknown) {
			if (processingError instanceof Error) {
				console.error(
					`[Webhook] Error during direct processing of event ${event.type}:`,
					processingError,
				);
				return new NextResponse(
					`Internal error processing event directly: ${processingError.message}`,
					{ status: 500 },
				);
			} else {
				console.error(
					`[Webhook] Unknown error during direct processing of event ${event.type}:`,
					processingError,
				);
				return new NextResponse(
					`Unknown internal error processing event directly`,
					{ status: 500 },
				);
			}
		}
	}

	// Success response to Stripe
	console.log(
		`[Webhook] Success: Event ${event.type} received and ready for processing.`,
	);
	return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
};
