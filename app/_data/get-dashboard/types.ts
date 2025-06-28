import {
	TransactionCategory,
	TransactionType,
	TransactionSubcategory,
} from "@prisma/client";

export type TransactionPercentagePerType = {
	[key in TransactionType]: number;
};

export interface TotalExpensePerCategory {
	category: TransactionCategory;
	totalAmount: number;
	percentageOfTotal: number;
	subcategories: {
		subcategory: TransactionSubcategory | null;
		totalAmount: number;
		percentageOfTotal: number;
	}[];
}

export interface TotalExpensePerSubcategory {
	category: TransactionCategory;
	subcategory: TransactionSubcategory | null;
	totalAmount: number;
	percentageOfTotal: number;
}
