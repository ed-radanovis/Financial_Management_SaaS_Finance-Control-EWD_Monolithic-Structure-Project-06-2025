"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/ui/select";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/app/_components/ui/tooltip";

const MONTH_OPTIONS = [
	{ value: "01", label: "Janeiro" },
	{ value: "02", label: "Fevereiro" },
	{ value: "03", label: "Março" },
	{ value: "04", label: "Abril" },
	{ value: "05", label: "Maio" },
	{ value: "06", label: "Junho" },
	{ value: "07", label: "Julho" },
	{ value: "08", label: "Agosto" },
	{ value: "09", label: "Setembro" },
	{ value: "10", label: "Outubro" },
	{ value: "11", label: "Novembro" },
	{ value: "12", label: "Dezembro" },
];

const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
	value: (new Date().getFullYear() + i - 5).toString(),
	label: (new Date().getFullYear() + i - 5).toString(),
}));

type TimeSelectProps = {
	className?: string;
	userPlan: string | null;
	userLoginDate: Date;
	month: string;
	year: string;
};

const TimeSelect: React.FC<TimeSelectProps> = ({
	className,
	userPlan,
	userLoginDate,
	month: initialMonth,
	year: initialYear,
}) => {
	const { push } = useRouter();

	const [month, setMonth] = useState<string>(() => {
		const savedMonth = sessionStorage.getItem("selectedMonth");
		const defaultMonth = String(new Date().getMonth() + 1).padStart(2, "0");
		const initialValue =
			savedMonth ||
			(initialMonth ? String(initialMonth).padStart(2, "0") : null) ||
			defaultMonth;
		return initialValue;
	});
	const [year, setYear] = useState<string>(() => {
		const savedYear = sessionStorage.getItem("selectedYear");
		return savedYear || initialYear || String(new Date().getFullYear());
	});

	const [isRestricted, setIsRestricted] = useState(false);

	useEffect(() => {
		sessionStorage.setItem("selectedMonth", month);
		sessionStorage.setItem("selectedYear", year);
		if (!isRestricted) {
			push(`/?month=${month}&year=${year}`, { scroll: false });
		}
	}, [month, year, push, isRestricted]);

	const handleMonthChange = (selectedMonth: string, selectedYear: string) => {
		const selectedDate = new Date(`${selectedYear}-${selectedMonth}-01`);
		const isPremiumUser =
			userPlan === "premium-mensal" || userPlan === "premium-semestral";
		if (!isPremiumUser) {
			const oneYearAgo = new Date(userLoginDate);
			oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

			const oneYearFuture = new Date(userLoginDate);
			oneYearFuture.setFullYear(oneYearFuture.getFullYear() + 1);

			// check if the selected date is outside the allowed range
			if (selectedDate < oneYearAgo || selectedDate > oneYearFuture) {
				setIsRestricted(true);
				return;
			}
		}
		setIsRestricted(false);
		setMonth(selectedMonth);
		setYear(selectedYear);
	};

	// get the month label
	const getMonthLabel = (monthValue: string) => {
		const option = MONTH_OPTIONS.find((opt) => opt.value === monthValue);
		return option ? option.label : "Mês";
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="flex flex-row gap-2 xl:gap-2">
						<Select
							onValueChange={(value) => handleMonthChange(value, year)}
							value={month}
						>
							<SelectTrigger
								className={`w-full transform text-base font-semibold transition-colors duration-500 ease-in-out md:text-xl xl:w-[180px] xl:text-base ${className}`}
							>
								<span className="truncate">{getMonthLabel(month)}</span>
							</SelectTrigger>
							<SelectContent>
								{MONTH_OPTIONS.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
										className="text-sm md:text-xl xl:text-xs"
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							onValueChange={(value) => handleMonthChange(month, value)}
							value={year}
						>
							<SelectTrigger
								className={`w-full transform text-base font-semibold transition-colors duration-500 ease-in-out md:text-xl xl:w-[90px] xl:text-sm ${className}`}
							>
								<SelectValue placeholder="Ano" />
							</SelectTrigger>
							<SelectContent>
								{YEAR_OPTIONS.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
										className="text-sm md:text-xl xl:text-xs"
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</TooltipTrigger>
				{isRestricted && (
					<TooltipContent
						className="max-w-[90vw] break-words border-[2px] border-white/50 bg-red-800/80 p-2 text-base font-bold md:text-lg xl:text-base"
						side="bottom"
						align="center"
					>
						<span className="block text-center">
							O período selecionado ultrapassa os 12 meses permitidos.
						</span>
						<span className="block text-center">
							Faça o Upgrade do seu plano para uma experiência completa.
						</span>
					</TooltipContent>
				)}
			</Tooltip>
		</TooltipProvider>
	);
};

export default TimeSelect;
