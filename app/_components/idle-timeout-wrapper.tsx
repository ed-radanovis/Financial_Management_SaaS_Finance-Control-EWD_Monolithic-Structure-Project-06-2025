"use client";

import { useIdleTimeout } from "../_hooks/useIdleTimeout";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "./ui/dialog";

interface IdleTimeoutWrapperProps {
	children: React.ReactNode;
}

export default function IdleTimeoutWrapper({
	children,
}: IdleTimeoutWrapperProps) {
	const { showIdleDialog } = useIdleTimeout();

	return (
		<>
			{children}
			{showIdleDialog && (
				<Dialog open={showIdleDialog}>
					<DialogContent className="max-w-[90vw] rounded-md p-4 md:max-w-[80vw] xl:max-w-[40vw]">
						<DialogHeader>
							<DialogTitle className="mt-6 text-center text-xl font-bold text-yellow-400 md:text-3xl xl:mt-0 xl:text-2xl">
								Sessão Expirada
							</DialogTitle>
							<DialogDescription className="text-center text-base md:text-xl xl:text-lg">
								Devido à inatividade você será desconectado e redirecionado para a
								página de login.
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
