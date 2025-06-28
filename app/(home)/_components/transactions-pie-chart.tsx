"use client";

import { Pie, PieChart, Tooltip, Cell } from "recharts";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TransactionType } from "@prisma/client";
import { TransactionPercentagePerType } from "@/app/_data/get-dashboard/types";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import PercentageItem from "./percentage-item";
import { useState, useEffect } from "react";

// custom hook for media queries
function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);
		const listener = () => setMatches(media.matches);
		setMatches(media.matches);
		media.addEventListener("change", listener);
		return () => media.removeEventListener("change", listener);
	}, [query]);

	return matches;
}

const chartConfig = {
	[TransactionType.INVESTMENT]: {
		label: "Investidos",
		color: "#FFFFFF",
	},
	[TransactionType.DEPOSIT]: {
		label: "Receitas",
		color: "#55B02E",
	},
	[TransactionType.EXPENSE]: {
		label: "Despesas",
		color: "#E93030",
	},
} satisfies ChartConfig;

interface TransactionsPieChartProps {
	typesPercentage: TransactionPercentagePerType;
	depositsTotal: number;
	investmentsTotal: number;
	expensesTotal: number;
	className?: string;
}

const TransactionsPieChart = ({
	depositsTotal,
	investmentsTotal,
	expensesTotal,
	typesPercentage,
	className,
}: TransactionsPieChartProps) => {
	// normalization invalid values
	const normalizeValue = (value: number) =>
		isNaN(value) || value === undefined ? 0 : value;
	// normalized values
	const normalizedDepositsTotal = normalizeValue(depositsTotal);
	const normalizedInvestmentsTotal = normalizeValue(investmentsTotal);
	const normalizedExpensesTotal = normalizeValue(expensesTotal);

	const totalPercentage = Object.values(typesPercentage).reduce(
		(acc, value) => acc + value,
		0,
	);

	const chartData = [
		{
			type: TransactionType.INVESTMENT,
			amount: normalizedInvestmentsTotal,
			fill: "url(#investmentGradient)",
		},
		{
			type: TransactionType.DEPOSIT,
			amount: normalizedDepositsTotal,
			fill: "url(#depositGradient)",
		},
		{
			type: TransactionType.EXPENSE,
			amount: normalizedExpensesTotal,
			fill: "url(#expenseGradient)",
		},
	];

	// set states for mobile and tablet
	const isMobile = useMediaQuery("(max-width: 845px)");
	const isTablet = useMediaQuery("(min-width: 846px) and (max-width: 1025px)");

	// adjust innerRadius and outerRadius for each breakpoint
	const innerRadius = isMobile ? 30 : isTablet ? 40 : 35;
	const outerRadius = isMobile ? 60 : isTablet ? 90 : 70;
	return (
		<Card
			className={`ml-2 w-full flex-col bg-white bg-opacity-2 md:ml-3 xl:ml-0 ${className || ""}`}
		>
			<CardContent className="flex-1 p-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="h-auto max-h-[120px] w-full md:max-h-[160px] lg:max-h-[180px] xl:mx-auto xl:mb-0 xl:aspect-square xl:max-h-[150px]"
				>
					<PieChart>
						<defs>
							<linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#ffffff33" />
								<stop offset="50%" stopColor="#ffffff7f" />
								<stop offset="100%" stopColor="#ffffff" />
							</linearGradient>
							<linearGradient id="depositGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#55b02e" />
								<stop offset="50%" stopColor="#55b02e7f" />
								<stop offset="100%" stopColor="#55b02e33" />
							</linearGradient>
							<linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="#e9303033" />
								<stop offset="50%" stopColor="#e930307f" />
								<stop offset="100%" stopColor="#e93030" />
							</linearGradient>
						</defs>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey="amount"
							nameKey="type"
							innerRadius={innerRadius}
							outerRadius={outerRadius}
							paddingAngle={0}
						>
							{chartData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.fill} />
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</ChartContainer>
				<div className="space-y-2 p-4 xl:mt-0 xl:space-y-1 xl:p-0 xl:px-4">
					<PercentageItem
						icon={
							<TrendingUpIcon size={16} className="text-primary md:size-7 xl:size-5" />
						}
						title="Receitas"
						value={typesPercentage[TransactionType.DEPOSIT]}
						totalPercentage={totalPercentage}
					/>
					<PercentageItem
						icon={
							<TrendingDownIcon
								size={16}
								className="text-danger md:size-7 xl:size-5"
							/>
						}
						title="Despesas"
						value={typesPercentage[TransactionType.EXPENSE]}
						totalPercentage={totalPercentage}
					/>
					<PercentageItem
						icon={<PiggyBankIcon size={16} className="md:size-7 xl:size-5" />}
						title="Investidos"
						value={typesPercentage[TransactionType.INVESTMENT]}
						totalPercentage={totalPercentage}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export default TransactionsPieChart;
