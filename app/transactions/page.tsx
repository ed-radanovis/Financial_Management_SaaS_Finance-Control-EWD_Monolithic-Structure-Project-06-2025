import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import dynamic from "next/dynamic";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import { canUserViewHistory } from "../_data/can-user-view-history";
import { generatePageMetadata } from "../_utils/metadata";

// Dynamic loading for Navbar
const Navbar = dynamic(() => import("../_components/navbar"), {
	ssr: false,
	loading: () => <div className="h-16 bg-white bg-opacity-2" />,
});

// dynamically changes browser tab title
export const generateMetadata = () => generatePageMetadata("Transações");

const TransactionsPage = async () => {
	// AUTH to access the specific page
	const { userId } = await auth();
	if (!userId) {
		redirect("/login");
	}

	// fetch user and check subscription
	const user = await clerkClient().users.getUser(userId);
	const userPlan =
		typeof user.publicMetadata.subscriptionPlan === "string"
			? user.publicMetadata.subscriptionPlan
			: null;

	const isPremium =
		userPlan === "premium-mensal" || userPlan === "premium-semestral";

	// get the allowed start date for viewing history
	const allowedStartDate = await canUserViewHistory();

	// access database transactions
	const allowedDate = allowedStartDate?.startDate
		? new Date(allowedStartDate.startDate)
		: null;

	const endDateLimit = new Date();
	endDateLimit.setFullYear(endDateLimit.getFullYear() + 1);

	const transactions = await db.transaction.findMany({
		where: {
			userId,
			...(isPremium
				? {} // premium users can view all transactions
				: {
						date: {
							...(allowedDate ? { gte: allowedDate } : {}),
							lte: endDateLimit,
						},
					}),
		},
		orderBy: {
			date: "desc",
		},
	});

	// determine if user can add transactions
	const userCanAddTransaction = await canUserAddTransaction();

	return (
		<>
			<Navbar className="bg-white bg-opacity-2" />
			<div className="flex flex-col space-y-6 overflow-hidden p-0 md:p-3 xl:p-6">
				{/* title and button */}
				<div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row md:gap-0">
					<h1 className="ml-0 mt-6 text-xl font-bold opacity-70 sm:ml-4 md:ml-4 md:mt-3 md:text-2xl xl:ml-4 xl:mt-0 xl:text-3xl">
						Transações
					</h1>
					<AddTransactionButton
						userCanAddTransaction={userCanAddTransaction}
						className="mr-0 text-xs shadow-md shadow-gray-700 transition-all duration-500 ease-in-out hover:shadow-gray-500 sm:mr-4 sm:mt-3 md:mr-4 md:mt-3 md:text-sm xl:mr-4"
					/>
				</div>
				{/* transactions table */}
				<ScrollArea className="h-[calc(100vh-265px)] shadow-md shadow-gray-800 sm:h-[calc(100vh-220px)] md:h-[calc(100vh-230px)] xl:h-full">
					<div className="custom-width-interval">
						<DataTable
							columns={transactionColumns}
							data={JSON.parse(JSON.stringify(transactions))}
							tableClassName="w-full table-auto"
						/>
					</div>
				</ScrollArea>
			</div>
		</>
	);
};

export default TransactionsPage;
