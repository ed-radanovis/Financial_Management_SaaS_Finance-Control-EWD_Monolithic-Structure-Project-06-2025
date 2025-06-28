"use client";

import { Button } from "@/app/_components/ui/button";
import { createStripeCheckout } from "../_actions/create-stripe-checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface AcquirePlanButtonProps {
	planType: "mensal" | "semestral";
	className?: string;
}

const AcquirePlanButton = ({ planType }: AcquirePlanButtonProps) => {
	const { user } = useUser();
	const handleAcquirePlanClick = async () => {
		const { sessionId } = await createStripeCheckout(planType);
		if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
			throw new Error("Stripe publishable key not found");
		}
		const stripe = await loadStripe(
			process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		);
		if (!stripe) {
			throw new Error("Stripe not found");
		}
		await stripe.redirectToCheckout({ sessionId });
	};
	const hasPremiumPlan =
		user?.publicMetadata.subscriptionPlan === "premium-mensal" ||
		user?.publicMetadata.subscriptionPlan === "premium-semestral";
	if (hasPremiumPlan) {
		return (
			<Button className="custom-active-transition w-full transform rounded-s-lg bg-white/20 text-lg font-bold text-primary transition-colors duration-500 ease-in-out hover:bg-primary/60 hover:text-white/80 active:scale-95">
				<Link
					href={`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL as string}?prefilled_email=${user.emailAddresses[0].emailAddress}`}
				>
					Gerenciar plano
				</Link>
			</Button>
		);
	}
	return (
		<Button
			className="text-md custom-active-transition w-full transform rounded-s-lg font-bold transition-colors duration-500 ease-in-out hover:bg-primary/60 hover:text-white/80 active:scale-95"
			onClick={handleAcquirePlanClick}
		>
			Adquirir Plano {planType === "mensal" ? "Mensal" : "Semestral"}
		</Button>
	);
};

export default AcquirePlanButton;
