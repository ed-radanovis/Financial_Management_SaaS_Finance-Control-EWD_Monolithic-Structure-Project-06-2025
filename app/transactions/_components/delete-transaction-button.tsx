"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import { TrashIcon } from "lucide-react";
import { deleteTransaction } from "../actions/delete-transaction";
import { toast } from "sonner";

interface DeleteTransactionButtonProps {
	transactionId: string;
	isMobilePortrait?: boolean;
}

const DeleteTransactionButton = ({
	transactionId,
	isMobilePortrait = false,
}: DeleteTransactionButtonProps) => {
	const handleConfirmDeleteClick = async () => {
		try {
			await deleteTransaction({ transactionId });
			toast.success("Transação deletada com sucesso!");
		} catch (error) {
			console.error(error);
			toast.error("Ocorreu um erro ao deletar a transação.");
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="custom-active-transition my-2 h-7 w-7 text-muted-foreground transition-colors duration-500 ease-in-out hover:text-danger active:scale-125 active:text-danger md:h-12 md:w-10 xl:h-10 xl:w-10 xl:active:text-red-800"
				>
					<TrashIcon
						className={
							isMobilePortrait ? "!h-5 !w-5" : "h-5 w-5 md:h-6 md:w-6 xl:h-5 xl:w-5"
						}
					/>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="max-w-[90vw] rounded-md md:max-w-[80vw] xl:max-w-[40vw]">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-base md:text-lg xl:text-xl">
						Você realmente deseja continuar com o cancelamento dessa transação?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-sm md:text-base xl:text-base">
						Essa ação não poderá ser desfeita.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="custom-active-transition transform bg-muted text-sm transition-colors duration-500 ease-in-out hover:bg-danger active:scale-95 md:text-base xl:text-base">
						Cancelar
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConfirmDeleteClick}
						className="custom-active-transition transform bg-muted text-sm transition-colors duration-500 ease-in-out hover:bg-primary active:scale-95 md:text-base xl:text-base"
					>
						Continuar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteTransactionButton;
