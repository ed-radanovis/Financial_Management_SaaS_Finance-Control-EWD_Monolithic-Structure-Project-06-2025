import { ReactNode } from "react";

interface PercentageItemProps {
	icon: ReactNode;
	title: string;
	value: number;
	totalPercentage: number;
}

const PercentageItem = ({
	icon,
	title,
	value,
	totalPercentage,
}: PercentageItemProps) => {
	// Ensure that the percentage calculation returns invalid values ​​that result in zero
	const percentage =
		totalPercentage > 0 && value > 0 ? (value / totalPercentage) * 100 : 0;

	return (
		<div className="itens-center mt-6 flex justify-between xl:mt-2">
			{/* Icon */}
			<div className="flex items-center gap-6 md:gap-10 xl:gap-6">
				<div className="mt-1 rounded-lg bg-white bg-opacity-3 p-[0.4rem] xl:mt-2">
					{icon}
				</div>
				<p className="text-base text-muted-foreground md:text-xl xl:mt-2 xl:text-base">
					{title}
				</p>
			</div>
			{/* percentage */}
			<p className="text-base font-bold md:text-xl xl:mt-2 xl:text-base">
				{percentage.toFixed(2)}%
			</p>
		</div>
	);
};

export default PercentageItem;
