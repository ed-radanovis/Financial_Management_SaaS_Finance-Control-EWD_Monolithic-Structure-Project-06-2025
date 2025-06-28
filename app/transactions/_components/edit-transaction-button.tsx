"use client";

import { Button } from "@/app/_components/ui/button";
import UpsertTransactionDialog from "@/app/_components/upsert-transaction-dialog";
import { Transaction } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

interface EditTransactionButtonProps {
	transaction: Transaction;
	isMobilePortrait?: boolean;
}

const EditTransactionButton = ({
	transaction,
	isMobilePortrait = false,
}: EditTransactionButtonProps) => {
	const [dialogIsOpen, setDialogIsOpen] = useState(false);

	const defaultValues = {
		...transaction,
		amount: Number(transaction.amount),
		subcategory: transaction.subcategory || "OTHER",
	};

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				className="custom-active-transition my-2 h-7 w-7 text-muted-foreground transition-colors duration-500 ease-in-out hover:text-yellow-500 active:scale-125 active:text-yellow-500 md:h-12 md:w-10 xl:h-10 xl:w-10 xl:active:text-yellow-800"
				onClick={() => setDialogIsOpen(true)}
			>
				<PencilIcon
					className={
						isMobilePortrait ? "!h-5 !w-5" : "h-5 w-5 md:h-6 md:w-6 xl:h-5 xl:w-5"
					}
				/>
			</Button>
			<UpsertTransactionDialog
				isOpen={dialogIsOpen}
				setIsOpen={setDialogIsOpen}
				defaultValues={defaultValues}
				transactionId={transaction.id}
			/>
		</>
	);
};

export default EditTransactionButton;
