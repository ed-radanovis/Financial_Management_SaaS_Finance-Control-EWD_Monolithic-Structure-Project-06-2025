"use client";

import { useEffect, useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Menu, X } from "lucide-react";

const NavLink = ({
	href,
	children,
	onClick,
}: {
	href: string;
	children: React.ReactNode;
	onClick?: () => void;
}) => {
	const pathname = usePathname();

	return (
		<Link
			href={href}
			className={clsx(
				"transform text-xl transition-transform duration-200 active:scale-95 md:text-2xl xl:text-xl",
				pathname === href ? "font-bold text-primary" : "text-muted-foreground",
			)}
			onClick={onClick}
		>
			{children}
		</Link>
	);
};

const Navbar = ({ className }: { className?: string }) => {
	const [isMounted, setIsMounted] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const { sessionId } = useAuth();

	useEffect(() => {
		setIsMounted(true);
		const handleResize = () => {
			const width = window.innerWidth;
			setIsMobile(width < 1025);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// monitoring authentication logout status
	useEffect(() => {
		if (!isMounted) return;
		if (sessionId === undefined) {
			sessionStorage.removeItem("selectedMonth");
			sessionStorage.removeItem("selectedYear");
		}
	}, [sessionId, isMounted]);

	if (!isMounted) return null;

	if (isMobile) {
		// Mobile and Landscape Navbar
		return (
			<nav
				className={clsx(
					"relative mx-2 mt-4 flex flex-col items-center justify-between rounded-md border border-solid px-1 py-3 md:px-6 md:py-0 md:pb-1",
					className,
				)}
			>
				<div className="flex w-full items-center justify-between">
					<div className="mt-2 flex flex-col items-center">
						<Image
							src="/logo_navbar.png"
							width={108}
							height={54}
							className="h-[45px] w-[90px] rounded-md border border-solid border-yellow-500 md:h-[60px] md:w-[120px]"
							alt="Finance Control EWD"
						/>
						<h1
							className="mt-1 bg-clip-text text-center text-[0.6rem] text-transparent md:mt-0 md:text-[0.8rem]"
							style={{
								background:
									"linear-gradient(164deg, rgba(126,86,41,1) 0%, rgba(114,95,54,1) 25%, rgba(169,157,132,1) 50%, rgba(205,191,130,1) 75%, rgba(238,198,15,1) 100%)",
								WebkitBackgroundClip: "text",
							}}
						>
							Finance Control EWD
						</h1>
					</div>
					{/* User Button */}
					<UserButton
						showName
						appearance={{
							elements: {
								avatarBox: "w-7 h-7 md:w-9 md:h-9 mt-3",
								userButtonBox:
									"flex flex-col-reverse items-center text-muted-foreground",
								userButtonOuterIdentifier: "text-xm md:text-base",
							},
						}}
					/>
					{/* Mobile Button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className={isMenuOpen ? "text-red-600" : "text-primary"}
					>
						{isMenuOpen ? (
							<X size={36} className="md:size-12" />
						) : (
							<Menu size={36} className="md:size-12" />
						)}
					</button>
				</div>
				{/* Mobile Menu */}
				{isMenuOpen && (
					<div className="absolute left-0 top-full z-40 flex w-full flex-col items-center gap-4 rounded-md border border-solid bg-black bg-opacity-90 py-6 shadow-md">
						<NavLink href="/" onClick={() => setIsMenuOpen(false)}>
							Dashboard
						</NavLink>
						<NavLink href="/transactions" onClick={() => setIsMenuOpen(false)}>
							Transações
						</NavLink>
						<NavLink href="/subscription" onClick={() => setIsMenuOpen(false)}>
							Assinatura
						</NavLink>
					</div>
				)}
			</nav>
		);
	} else {
		// desktop Navbar
		return (
			<nav
				className={clsx(
					"mx-6 mt-4 flex h-fit justify-between rounded-md border border-solid px-8 py-3",
					className,
				)}
			>
				{/* left side of the navbar */}
				<div className="flex items-center">
					<div className="flex h-[60px] w-[350px] gap-2">
						<Image
							src="/logo_navbar.png"
							width={120}
							height={60}
							alt="Finance Control EWD"
							className="rounded-md border border-solid border-yellow-500"
						/>
						<h1
							className="text-1xl mt-4 bg-clip-text text-transparent"
							style={{
								background:
									"linear-gradient(164deg, rgba(126,86,41,1) 0%, rgba(114,95,54,1) 25%, rgba(169,157,132,1) 50%, rgba(205,191,130,1) 75%, rgba(238,198,15,1) 100%)",
								WebkitBackgroundClip: "text",
							}}
						>
							Finance Control EWD
						</h1>
					</div>
					<div className="flex items-center text-lg md:gap-4 xl:ml-24 xl:gap-24">
						<NavLink href="/">Dashboard</NavLink>
						<NavLink href="/transactions">Transações</NavLink>
						<NavLink href="/subscription">Assinatura</NavLink>
					</div>
				</div>
				{/* right side of the navbar */}
				<UserButton showName />
			</nav>
		);
	}
};

export default Navbar;
export { NavLink };
