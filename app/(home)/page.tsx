import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { parse } from "date-fns";
import { getDashboard } from "../_data/get-dashboard";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import { generatePageMetadata } from "../_utils/metadata";

// dynamic loading for components
const Navbar = dynamic(() => import("../_components/navbar"), {
	ssr: false,
	loading: () => <div className="h-16 bg-white bg-opacity-2" />,
});

const SummaryCards = dynamic(() => import("./_components/summary-cards"), {
	ssr: false,
});

const TimeSelect = dynamic(() => import("./_components/time-select"), {
	ssr: false,
});

const TransactionsPieChart = dynamic(
	() => import("./_components/transactions-pie-chart"),
	{
		ssr: false,
	},
);

const ExpensesPerCategory = dynamic(
	() => import("./_components/expenses-per-category"),
	{
		ssr: false,
	},
);

const LastTransactions = dynamic(
	() => import("./_components/last-transactions"),
	{
		ssr: false,
	},
);

const AiReportButton = dynamic(() => import("./_components/ai-report-button"), {
	ssr: false,
});

// fetch user data with retry
const fetchUserWithRetry = async (
	userId: string,
	retries = 3,
	delay = 1000,
) => {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const user = await clerkClient().users.getUser(userId);
			return user;
		} catch {
			if (attempt === retries) {
				throw new Error("Failed to fetch user from Clerk after retries");
			}
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
};

// dynamically changes browser tab title
export const metadata = generatePageMetadata("Dashboard");

interface HomeProps {
	searchParams: {
		month: string;
		year: string;
	};
}

const Home = async ({ searchParams: { month, year } }: HomeProps) => {
	// AUTH to access the specific page
	const { userId } = await auth();
	if (!userId) {
		redirect("/login");
	}

	// get user data from Clerk with retry
	let user;
	try {
		user = await fetchUserWithRetry(userId);
	} catch {
		redirect("/login?error=session-expired");
	}

	// ensure user is defined
	if (!user) {
		redirect("/login?error=user-not-found");
	}

	const userPlan =
		typeof user.publicMetadata.subscriptionPlan === "string"
			? user.publicMetadata.subscriptionPlan
			: null;

	const isPremium =
		userPlan === "premium-mensal" || userPlan === "premium-semestral";
	const userLoginDate = new Date(user.createdAt);

	// check entered date / start current month
	const formattedMonth = month ? String(month).padStart(2, "0") : null;
	const monthIsInvalid =
		!formattedMonth || !parse(formattedMonth, "MM", new Date());
	const yearIsInvalid = !year || !parse(year, "yyyy", new Date());
	if (monthIsInvalid || yearIsInvalid) {
		const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
		const currentYear = String(new Date().getFullYear());
		redirect(`/?month=${currentMonth}&year=${currentYear}`);
	}

	// get the data from the Dashboard
	const dashboard = await getDashboard(formattedMonth, year);
	const userCanAddTransaction = await canUserAddTransaction();

	return (
		<>
			<Navbar className="bg-white bg-opacity-2" />
			<div className="flex min-h-screen flex-col space-y-4 p-2 xl:h-full xl:space-y-5 xl:overflow-hidden xl:p-6 xl:py-6 xl:pt-5">
				<div className="flex w-full flex-col items-center justify-between gap-1 md:gap-0 xl:flex-row">
					<h1 className="ml-0 mt-4 text-xl font-bold opacity-70 md:ml-4 md:text-2xl xl:ml-4 xl:mt-0 xl:text-3xl">
						Dashboard
					</h1>
					<div className="mt-4 flex flex-col items-center gap-3 md:gap-4 xl:mt-0 xl:flex-row xl:items-center xl:gap-3 xl:pr-2">
						<AiReportButton month={formattedMonth} hasPremiumPlan={isPremium} />
						<TimeSelect
							className="w-[47vw] hover:bg-[#ffffff1a] md:w-[48vw] xl:w-auto"
							userPlan={userPlan}
							userLoginDate={userLoginDate}
							month={formattedMonth}
							year={year}
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-2 xl:h-full xl:grid-cols-[2fr,1fr] xl:gap-4">
					<div className="flex flex-col gap-4 md:gap-6 xl:h-full xl:gap-4">
						<SummaryCards
							month={formattedMonth}
							year={year}
							{...dashboard}
							userCanAddTransaction={userCanAddTransaction}
							className="xl:w-auto"
						/>
						<div className="grid grid-cols-1 gap-4 md:gap-6 xl:h-full xl:grid-cols-3 xl:grid-rows-1 xl:gap-4">
							<TransactionsPieChart {...dashboard} className="xl:h-[41vh] xl:w-auto" />
							<ExpensesPerCategory
								expensesPerCategory={dashboard.totalExpensePerCategory}
								className="mb-2 rounded-md border md:mb-4 xl:overflow-auto"
							/>
						</div>
					</div>
					<LastTransactions
						lastTransactions={dashboard.lastTransactions}
						className="bg-white bg-opacity-2 xl:overflow-auto"
					/>
				</div>
			</div>
		</>
	);
};

export default Home;
