import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ReactElement } from "react";
import { WalletIcon } from "lucide-react";
import React from "react";

type LucideIconProps = React.ComponentProps<typeof WalletIcon>;

interface SummaryCardProps {
	icon: ReactElement<LucideIconProps>;
	title: string;
	amount: number;
	size?: "small" | "large";
	userCanAddTransaction?: boolean;
	className?: string;
	iconSize?: number;
	iconClassName?: string;
}

const SummaryCard = ({
	icon,
	title,
	amount,
	size = "small",
	userCanAddTransaction,
	className,
	iconSize,
	iconClassName,
}: SummaryCardProps) => {
	return (
		<Card
			className={`${
				size === "large"
					? "bg-white bg-opacity-4 py-1 xl:bg-opacity-4"
					: "bg-white bg-opacity-2 xl:bg-opacity-2"
			} ${className || ""} w-full xl:w-auto`}
		>
			<CardHeader className="flex flex-col justify-center gap-2 p-2 xl:flex-row xl:items-center xl:justify-start xl:gap-4 xl:p-4 xl:pt-0">
				<div className="flex items-center justify-center gap-10 xl:ml-0 xl:flex-row xl:items-center xl:justify-start xl:gap-6">
					{React.isValidElement(icon) &&
						React.cloneElement(icon, {
							size: iconSize,
							className: `ml-0 xl:ml-0 ${iconClassName || ""}`,
						})}
					<p
						className={`${
							size === "small"
								? "text-base text-muted-foreground md:text-xl xl:mr-10 xl:text-base"
								: "text-lg opacity-70 md:text-2xl xl:text-lg"
						}`}
					>
						{title}
					</p>
				</div>
			</CardHeader>
			<CardContent className="p-2 xl:p-4 xl:pt-0">
				<div className="flex flex-col items-center gap-2 xl:flex-row xl:items-center xl:justify-between">
					<p
						className={`font-bold ${
							size === "small"
								? "text-xl md:text-3xl xl:mx-auto xl:text-2xl"
								: "text-2xl md:text-4xl xl:ml-16 xl:text-3xl"
						}`}
					>
						{Intl.NumberFormat("pt-BR", {
							style: "currency",
							currency: "BRL",
						}).format(amount)}
					</p>
					{size === "large" && (
						<AddTransactionButton
							userCanAddTransaction={userCanAddTransaction}
							className="mt-4 xl:mt-0"
						/>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default SummaryCard;
