import { Button } from "@/app/_components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@/app/_constants/transactions";
import { Transaction, TransactionType } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { formatCurrency } from "@/app/_utils/currency";

interface LastTransactionsProps {
	lastTransactions: Transaction[];
	className?: string;
}

const LastTransactions = ({
	lastTransactions,
	className,
}: LastTransactionsProps) => {
	const getAmountColor = (transaction: Transaction) => {
		if (transaction.type === TransactionType.EXPENSE) {
			return "text-danger";
		}
		if (transaction.type === TransactionType.DEPOSIT) {
			return "text-primary";
		}
		return "text-white";
	};
	const getAmountPrefix = (transaction: Transaction) => {
		if (transaction.type === TransactionType.DEPOSIT) {
			return "+";
		}
		return "-";
	};
	return (
		<ScrollArea
			className={clsx(
				"h-[300px] rounded-md border shadow-md shadow-gray-800 md:h-[400px] xl:h-[75vh]",
				className,
			)}
		>
			<CardHeader className="flex-row items-center justify-between p-2 xl:p-4">
				<CardTitle className="ml-4 text-lg font-bold md:ml-5 md:text-2xl xl:text-xl">
					Últimas Transações
				</CardTitle>
				<Button
					variant="outline"
					className="custom-active-transition-last-transaction rounded-md text-sm font-bold shadow-md shadow-gray-800 transition-all duration-500 ease-in-out active:scale-105 active:bg-primary md:text-xl xl:text-base"
					asChild
				>
					<Link href="/transactions">Ver mais</Link>
				</Button>
			</CardHeader>
			<CardContent className="space-y-3 p-2 px-6 md:space-y-5 xl:p-4 xl:px-8">
				{lastTransactions.map((transaction) => (
					<div key={transaction.id} className="flex items-center justify-between">
						<div className="flex items-center gap-4 md:gap-10 xl:gap-6">
							<div className="rounded-md bg-white bg-opacity-7 p-1 text-white md:p-3 xl:p-2">
								<Image
									src={`/${TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}`}
									height={16}
									width={20}
									alt="Imagem do método de pagamento"
									className="md:h-8 md:w-10 xl:h-6 xl:w-8"
								/>
							</div>
							<div>
								<p className="text-sm font-bold md:text-xl xl:text-base">
									{transaction.name}
								</p>
								<p className="text-xs text-muted-foreground md:text-lg xl:text-sm">
									{new Date(transaction.date).toLocaleDateString("pt-BR", {
										day: "2-digit",
										month: "short",
										year: "numeric",
									})}
								</p>
							</div>
						</div>
						<p
							className={`text-sm font-bold md:text-xl ${getAmountColor(transaction)} xl:text-base`}
						>
							{getAmountPrefix(transaction)}
							{formatCurrency(Number(transaction.amount))}
						</p>
					</div>
				))}
			</CardContent>
		</ScrollArea>
	);
};

export default LastTransactions;
