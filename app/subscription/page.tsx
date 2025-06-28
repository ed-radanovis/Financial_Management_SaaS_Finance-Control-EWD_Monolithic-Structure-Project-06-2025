import { auth, clerkClient } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { generatePageMetadata } from "../_utils/metadata";
import { format, startOfMonth } from "date-fns";
import { getCurrentMonthTransactions } from "../_data/get-current-month-transactions";
import SubscriptionPlans from "./_components/subscription-plans";

// dynamic loading for Navbar and Footer
const Navbar = dynamic(() => import("../_components/navbar"), {
	ssr: false,
	loading: () => <div className="h-16 bg-white bg-opacity-2" />,
});

const Footer = dynamic(() => import("../_components/footer"), {
	ssr: false,
	loading: () => <div className="mt-4 h-12 md:mt-0 xl:mt-0" />,
});

// dynamically changes browser tab title
export const metadata = generatePageMetadata("Assinaturas");

const SubscriptionPage = async () => {
	const { userId } = await auth();
	if (!userId) {
		redirect("/login");
	}

	const user = await clerkClient.users.getUser(userId);
	const currentMonthTransactions = await getCurrentMonthTransactions();

	const userCreationDate = new Date(user.createdAt);
	const firstDayOfUserMonth = !isNaN(userCreationDate.getTime())
		? startOfMonth(userCreationDate)
		: new Date();

	const historyStartDate = format(firstDayOfUserMonth, "MM-yyyy");

	return (
		<div className="flex min-h-screen flex-col">
			<Navbar className="bg-white bg-opacity-2" />
			<main className="flex-grow overflow-hidden">
				<div className="flex justify-center">
					<h1 className="mb-3 mt-4 text-xl font-bold opacity-70 md:ml-4 md:text-2xl xl:ml-4 xl:mt-4 xl:text-3xl">
						Assinaturas
					</h1>
				</div>
				<SubscriptionPlans
					currentMonthTransactions={currentMonthTransactions}
					historyStartDate={historyStartDate}
				/>
			</main>
			<Footer className="mt-4 md:mt-0 xl:mt-0" />
		</div>
	);
};

export default SubscriptionPage;
