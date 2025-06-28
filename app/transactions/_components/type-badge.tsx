import { Badge } from "@/app/_components/ui/badge";
import { Transaction, TransactionType } from "@prisma/client";
import { CircleIcon } from "lucide-react";

interface TransactionTypeBadgeProps {
	transaction: Transaction;
}

const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
	const getBadgeStyles = () => {
		switch (transaction.type) {
			case TransactionType.DEPOSIT:
				return {
					badge: "bg-green-500 bg-opacity-10 text-primary hover:bg-muted",
					iconFill: "fill-primary",
					label: "Depósito",
				};
			case TransactionType.EXPENSE:
				return {
					badge: "bg-danger bg-opacity-10 text-danger hover:bg-muted",
					iconFill: "fill-danger",
					label: "Despesa",
				};
			case TransactionType.INVESTMENT:
				return {
					badge: "bg-white bg-opacity-10 text-white hover:bg-muted",
					iconFill: "fill-white",
					label: "Investimento",
				};
			default:
				return {
					badge: "bg-white bg-opacity-10 text-white hover:bg-muted",
					iconFill: "fill-white",
					label: "Desconhecido",
				};
		}
	};

	const { badge, iconFill, label } = getBadgeStyles();

	return (
		<Badge
			className={`rounded-md px-2 py-0 text-sm font-bold md:px-0 md:text-xs xl:text-sm xl:font-medium ${badge} badge`}
		>
			<CircleIcon className={`mr-2 ${iconFill}`} size={8} />
			{label}
		</Badge>
	);
};

export default TransactionTypeBadge;
