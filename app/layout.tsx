import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { dark } from "@clerk/themes";
import dynamic from "next/dynamic";
import { Spinner } from "./_components/ui/spinner";

// client component to hook user Idle Timeout
const IdleTimeoutWrapper = dynamic(
	() => import("./_components/idle-timeout-wrapper"),
	{
		ssr: false, // disable Server-Side Rendering
	},
);

const mulish = Mulish({
	subsets: ["latin-ext"],
});

export const metadata: Metadata = {
	title: "Finance Control EWD",
	description: "Controle de finanças",
	icons: {
		icon: "/favicon.ico",
	},
};

// dynamic component to avoid hydration issues with ClerkProvider
const DynamicClerkProvider = dynamic(
	() => import("@clerk/nextjs").then((mod) => mod.ClerkProvider),
	{
		ssr: false,
		loading: () => (
			<div className="flex min-h-screen flex-col items-center justify-center gap-6">
				<Spinner size="lg" className="bg-black dark:bg-white" />
				<span className="text-2xl font-semibold text-white opacity-20 md:text-3xl xl:text-2xl">
					Loading ...
				</span>
			</div>
		),
	},
);

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${mulish.className} dark min-h-screen antialiased xl:h-screen`}
			>
				<DynamicClerkProvider
					appearance={{
						baseTheme: dark,
					}}
					afterSignOutUrl="/login"
				>
					<IdleTimeoutWrapper>
						<div className="flex min-h-screen flex-col xl:h-screen xl:overflow-hidden">
							{children}
						</div>
					</IdleTimeoutWrapper>
				</DynamicClerkProvider>
			</body>
		</html>
	);
}
