import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import {
	TRANSACTION_CATEGORY_LABELS,
	TRANSACTION_SUBCATEGORY_LABELS,
} from "@/app/_constants/transactions";
import { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";
import clsx from "clsx";

interface ExpensesPerCategoryProps {
	expensesPerCategory: TotalExpensePerCategory[];
	className?: string;
}

const ExpensesPerCategory = ({
	expensesPerCategory,
	className,
}: ExpensesPerCategoryProps) => {
	const totalExpenses = expensesPerCategory.reduce(
		(acc, category) => acc + category.totalAmount,
		0,
	);

	if (totalExpenses === 0) {
		return (
			<ScrollArea
				className={clsx(
					"col-span-2 h-[250px] rounded-md border bg-white bg-opacity-2 p-2 md:h-[350px] xl:h-[41vh] xl:p-4",
					className,
				)}
			>
				<CardHeader>
					<CardTitle className="text-lg font-bold md:text-2xl xl:text-xl">
						Gastos por Categoria
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center">
					<p className="text-sm text-gray-500 md:text-base">
						Nenhum gasto registrado.
					</p>
				</CardContent>
			</ScrollArea>
		);
	}

	return (
		<ScrollArea
			className={clsx(
				"col-span-2 h-[250px] rounded-md border bg-white bg-opacity-2 p-2 shadow-md shadow-gray-800 md:h-[350px] xl:h-[41vh] xl:p-4",
				className,
			)}
		>
			<CardHeader>
				<CardTitle className="text-base font-bold md:text-2xl xl:text-xl">
					Gastos por Categorias & Subcategorias
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{expensesPerCategory.map((category) => (
					<div key={category.category} className="space-y-2">
						<div className="space-y-1">
							<div className="flex w-full justify-between">
								<p className="mt-2 text-sm font-bold md:text-xl xl:text-base">
									{TRANSACTION_CATEGORY_LABELS[category.category]}
								</p>
								<p className="mt-2 text-sm font-bold md:mt-4 md:text-xl xl:mt-2 xl:text-base">
									{((category.totalAmount / totalExpenses) * 100).toFixed(2)}%
								</p>
							</div>
							<Progress
								value={(category.totalAmount / totalExpenses) * 100}
								className="h-2 bg-green-200 md:h-3 xl:h-3"
								aria-label={`${TRANSACTION_CATEGORY_LABELS[category.category]} - ${(category.totalAmount / totalExpenses) * 100}%`}
							/>
						</div>
						{category.subcategories && category.subcategories.length > 0 && (
							<div className="ml-4 space-y-1">
								{category.subcategories.map((subcategory) => (
									<div key={subcategory.subcategory} className="space-y-1">
										<div className="flex w-full justify-between">
											<p className="mt-2 text-xs font-bold text-muted-foreground md:text-lg xl:text-sm">
												{TRANSACTION_SUBCATEGORY_LABELS[subcategory.subcategory!]}
											</p>
											<p className="mr-6 mt-2 text-xs font-bold text-muted-foreground md:mr-9 md:mt-4 md:text-lg xl:mr-8 xl:mt-2 xl:text-sm">
												{((subcategory.totalAmount / totalExpenses) * 100).toFixed(2)}%
											</p>
										</div>
										<Progress
											value={(subcategory.totalAmount / totalExpenses) * 100}
											className="h-2 max-w-[95%] bg-white md:h-3 xl:h-3"
											aria-label={`${TRANSACTION_SUBCATEGORY_LABELS[subcategory.subcategory!]} - ${(subcategory.totalAmount / totalExpenses) * 100}%`}
											customColor="linear-gradient(to bottom, #d3d3d3d7, #d3d3d37a, #a1a1aa33)"
										/>
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</CardContent>
		</ScrollArea>
	);
};

export default ExpensesPerCategory;
