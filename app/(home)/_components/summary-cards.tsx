import {
	PiggyBankIcon,
	TrendingDownIcon,
	TrendingUpIcon,
	WalletIcon,
} from "lucide-react";
import SummaryCard from "./summary-card";

interface SummaryCardsProps {
	month: string;
	year: string;
	balance: number;
	depositsTotal: number;
	investmentsTotal: number;
	expensesTotal: number;
	userCanAddTransaction?: boolean;
	className?: string;
}

const SummaryCards = ({
	balance,
	depositsTotal,
	investmentsTotal,
	expensesTotal,
	userCanAddTransaction,
	month,
	year,
}: SummaryCardsProps) => {
	return (
		<div className="space-y-4 md:space-y-6 xl:space-y-4">
			{/* main card */}
			<SummaryCard
				icon={<WalletIcon size={36} />}
				title={`Saldo em ${month}/${year}`}
				amount={balance}
				size="large"
				userCanAddTransaction={userCanAddTransaction}
				iconClassName="rounded-sm bg-white bg-opacity-10 xl:ml-0 md:h-10 md:w-10 xl:h-8 xl:w-14"
			/>
			{/* secondary cards */}
			<div className="grid grid-cols-1 gap-4 rounded md:gap-6 xl:grid-cols-3 xl:gap-4">
				<SummaryCard
					icon={<PiggyBankIcon size={36} />}
					title={`Investidos em ${month}/${year}`}
					amount={investmentsTotal}
					iconClassName="mt-2 rounded-sm bg-white bg-opacity-10 md:h-9 md:w-9 xl:h-8 xl:w-12"
				/>
				<SummaryCard
					icon={<TrendingUpIcon size={36} />}
					title={`Receitas em ${month}/${year}`}
					amount={depositsTotal}
					iconClassName="mt-2 rounded-sm bg-[#84cc16] bg-opacity-15 text-primary xl:h-8 xl:w-12 md:h-9 md:w-9"
				/>
				<SummaryCard
					icon={<TrendingDownIcon size={36} />}
					title={`Despesas em ${month}/${year}`}
					amount={expensesTotal}
					iconClassName="mt-2 rounded-sm bg-danger bg-opacity-15 text-danger xl:h-8 xl:w-12 md:h-9 md:w-9"
				/>
			</div>
		</div>
	);
};

export default SummaryCards;
