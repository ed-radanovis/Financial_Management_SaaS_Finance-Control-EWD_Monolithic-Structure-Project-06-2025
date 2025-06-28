"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";

interface AddTransactionButtonProps {
	userCanAddTransaction?: boolean;
	className?: string;
}

// disable add transaction button when exceeding free limit
const AddTransactionButton = ({
	userCanAddTransaction = true,
	className,
}: AddTransactionButtonProps) => {
	const [dialogIsOpen, setDialogIsOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [showRestrictionDialog, setShowRestrictionDialog] = useState(false);

	// detect mobile by screen width
	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth < 1025;
			setIsMobile(mobile);
			console.log("Is Mobile:", mobile);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const handleButtonClick = () => {
		if (!userCanAddTransaction) {
			if (isMobile) {
				setShowRestrictionDialog(true); // display the Dialog on mobile
			}
		} else {
			setDialogIsOpen(true); // open the UpsertTransactionDialog if allowed
		}
	};

	return (
		<>
			{isMobile ? (
				// for mobile, use Dialog for restriction
				<>
					<Button
						className={`custom-active-transition transform rounded-s-lg text-sm font-bold transition-colors duration-500 ease-in-out hover:bg-primary/60 hover:text-white/80 active:scale-95 active:opacity-60 md:text-2xl ${className || ""} xl:text-lg ${
							!userCanAddTransaction ? "cursor-not-allowed opacity-50" : "opacity-95"
						}`}
						onClick={handleButtonClick}
					>
						Adicionar Transação
						<ArrowDownUpIcon />
					</Button>
					<Dialog
						open={showRestrictionDialog}
						onOpenChange={setShowRestrictionDialog}
					>
						<DialogContent className="max-w-[90vw] rounded-md p-4 md:max-w-[80vw] xl:max-w-[40vw]">
							<DialogHeader>
								<DialogTitle className="text-center text-xl font-bold text-yellow-400 md:text-3xl xl:text-2xl">
									Limite Atingido
								</DialogTitle>
								<DialogDescription className="text-center text-base md:text-xl xl:text-lg">
									<span className="block">O limite de transações mensais para o</span>
									<span className="block">
										plano básico foi atingido. Faça o Upgrade,
									</span>
									<span className="block">e obtenha todos os recursos agora mesmo.</span>
								</DialogDescription>
							</DialogHeader>
						</DialogContent>
					</Dialog>
					<UpsertTransactionDialog
						isOpen={dialogIsOpen}
						setIsOpen={setDialogIsOpen}
					/>
				</>
			) : (
				// for desktop, use Tooltip for restriction
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="relative inline-block">
								<Button
									className={`custom-active-transition transform rounded-s-lg text-sm font-bold transition-colors duration-500 ease-in-out hover:bg-primary/60 hover:text-white/80 active:scale-95 active:bg-primary/20 active:opacity-60 md:text-2xl ${className || ""} xl:text-lg ${
										!userCanAddTransaction
											? "cursor-not-allowed opacity-50"
											: "opacity-95"
									}`}
									onClick={handleButtonClick}
								>
									Adicionar Transação
									<ArrowDownUpIcon />
								</Button>
							</div>
						</TooltipTrigger>
						{!userCanAddTransaction && (
							<TooltipContent className="max-w-[90vw] break-words border-[2px] border-white/50 bg-red-800/70 p-2 text-sm font-bold xl:text-base">
								<span className="block text-center">
									Limite de transações atingido. Faça o Upgrade
								</span>
								<span className="block text-center">
									do seu plano, e obtenha todos os recursos agora.
								</span>
							</TooltipContent>
						)}
					</Tooltip>
					<UpsertTransactionDialog
						isOpen={dialogIsOpen}
						setIsOpen={setDialogIsOpen}
					/>
				</TooltipProvider>
			)}
		</>
	);
};

export default AddTransactionButton;
