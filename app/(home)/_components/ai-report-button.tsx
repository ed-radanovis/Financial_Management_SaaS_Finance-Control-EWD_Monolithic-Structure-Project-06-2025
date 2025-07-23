"use client";

import { Button } from "@/app/_components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/ui/dialog";
import { BotIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { generateAiReport } from "../_actions/generate-ai-report";
import Markdown from "react-markdown";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";

interface AiReportButtonProps {
	month: string;
	hasPremiumPlan: boolean;
}

const AiReportButton = ({ month, hasPremiumPlan }: AiReportButtonProps) => {
	const [report, setReport] = useState<string | null>(null);
	const [reportIsLoading, setReportIsLoading] = useState(false);
	const [reportGenerated, setReportGenerated] = useState(false);
	const [showNoTransactionsDialog, setShowNoTransactionsDialog] =
		useState(false);
	const [showPremiumRequiredDialog, setShowPremiumRequiredDialog] =
		useState(false);
	const [showGenericErrorDialog, setShowGenericErrorDialog] = useState(false);

	const searchParams = useSearchParams();
	const year = searchParams.get("year");

	const handleGenerateReportClick = async () => {
		if (!month || !year) {
			console.error("Mês e ano não podem ser nulos");
			return;
		}

		setReportIsLoading(true);
		const result = await generateAiReport({ month, year });

		if (result.success) {
			console.log({ aiReport: result.report });
			setReport(result.report);
			setReportGenerated(true);
		} else {
			if (result.error === "NO_TRANSACTIONS_FOUND_FOR_MONTH") {
				setShowNoTransactionsDialog(true);
			} else if (result.error === "PREMIUM_PLAN_REQUIRED") {
				setShowPremiumRequiredDialog(true);
			} else if (result.error === "Unauthorized") {
				console.error("Usuário não autorizado.");
				setShowGenericErrorDialog(true);
			} else if (result.error === "GEMINI_API_ERROR") {
				console.error("Erro na API do Gemini:", result.error);
				setShowGenericErrorDialog(true);
			} else {
				console.error("Ocorreu um erro inesperado:", result.error);
				setShowGenericErrorDialog(true);
			}
		}
		setReportIsLoading(false);
	};

	const handlePrintReportClick = () => {
		if (!report) {
			console.error("Relatório não gerado");
			return;
		}
		// PDF formatting
		const pdf = new jsPDF({
			unit: "cm",
			format: "A4",
		});
		pdf.setFontSize(12);
		pdf.setFont("Arial", "normal");
		pdf.setLineWidth(0.5);
		pdf.setFillColor(169, 169, 169, 0.2);
		pdf.rect(0.5, 0.5, 20, 1.2, "F");
		pdf.setLineWidth(0.01);
		pdf.setDrawColor(0, 0, 0);
		pdf.rect(0.5, 0.5, 20, 1.2, "S");
		// add custom header to PDF
		pdf.addImage(
			"logo finance control EWD redondo.png",
			"png",
			2.5,
			0.65,
			1.8,
			0.9,
		);
		pdf.setFont("bold");
		pdf.setTextColor(128, 128, 128);
		pdf.text(
			"Relatório gerado por IA através do aplicativo FINANCE CONTROL EWD",
			4.8,
			1.2,
		);
		pdf.setTextColor(0, 0, 0);
		pdf.setFont("Arial", "normal");
		// insert information from the dynamically generated report
		const reportLines = report.split("\n");
		let y = 4;
		for (const line of reportLines) {
			const lines = pdf.splitTextToSize(line, 16);
			for (const text of lines) {
				const newText = text.replace(/\*/g, "•").replace(/#/g, "-");
				pdf.text(newText, 2, y, { align: "justify" });
				y += 0.8;
				if (y > 27.5) {
					pdf.addPage();
					y = 1;
				}
			}
		}
		pdf.save("relatorio.pdf");
	};

	// defining custom components for Markdown with correct typing
	const markdownComponents = {
		h2: (props: React.ComponentProps<"h2">) => (
			<h2 className="mb-2 text-xl font-semibold text-white/80" {...props} />
		),
		h3: (props: React.ComponentProps<"h3">) => (
			<h3 className="mb-2 text-lg font-semibold text-white" {...props} />
		),
		h4: (props: React.ComponentProps<"h4">) => (
			<h4 className="mb-2 text-base font-semibold text-white" {...props} />
		),
		p: (props: React.ComponentProps<"p">) => (
			<p className="mb-2 text-base text-white/50" {...props} />
		),
		strong: (props: React.ComponentProps<"strong">) => (
			<strong className="font-bold text-white" {...props} />
		),
		li: (props: React.ComponentProps<"li">) => (
			<li className="text-base text-white/50" {...props} />
		),
		ul: (props: React.ComponentProps<"ul">) => (
			<ul className="mb-2 list-inside list-disc" {...props} />
		),
		ol: (props: React.ComponentProps<"ol">) => (
			<ol className="mb-2 list-inside list-decimal" {...props} />
		),
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) {
					setReport(null);
					setReportGenerated(false);
					setShowNoTransactionsDialog(false);
					setShowPremiumRequiredDialog(false);
					setShowGenericErrorDialog(false);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="custom-active-transition w-[96vw] border text-sm font-semibold shadow-md shadow-gray-800 transition-colors duration-500 ease-in-out active:scale-105 active:text-primary md:text-xl lg:text-2xl xl:w-auto xl:text-base"
				>
					Gerar relatório com IA
					<BotIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[90vw] rounded-md p-4 md:max-w-[80vw] xl:max-w-[40vw]">
				{hasPremiumPlan ? (
					<>
						<DialogHeader>
							<DialogTitle className="text-lg md:text-2xl xl:text-xl">
								Relatório IA
							</DialogTitle>
							<DialogDescription className="break-words text-sm md:text-lg xl:text-base">
								Use inteligência artificial para gerar um relatório com insights sobre
								suas finanças.
							</DialogDescription>
						</DialogHeader>
						<ScrollArea className="prose max-h-[60vh] md:max-h-[70vh] xl:max-h-[65vh]">
							<Markdown components={markdownComponents}>{report}</Markdown>
						</ScrollArea>
						<DialogFooter className="gap-3">
							{reportGenerated ? (
								<Button
									onClick={handlePrintReportClick}
									variant="ghost"
									className="custom-active-transition bg-muted text-sm font-bold transition-colors duration-500 ease-in-out hover:bg-[#6f2b6f] active:scale-95 xl:text-base"
								>
									Download PDF
								</Button>
							) : (
								<>
									<DialogClose asChild>
										<Button
											variant="ghost"
											className="custom-active-transition bg-muted text-sm font-bold transition-colors duration-500 ease-in-out hover:bg-danger active:scale-95 xl:text-base"
										>
											Cancelar
										</Button>
									</DialogClose>
									<Button
										onClick={handleGenerateReportClick}
										variant="ghost"
										className="custom-active-transition bg-muted text-sm font-bold transition-colors duration-500 ease-in-out hover:bg-primary active:scale-95 xl:text-base"
										disabled={reportIsLoading}
									>
										{reportIsLoading && <Loader2Icon className="animate-spin" />}
										Gerar relatório
									</Button>
								</>
							)}
						</DialogFooter>
					</>
				) : (
					<DialogHeader>
						<DialogTitle className="text-center text-xl font-bold text-yellow-400 md:text-3xl xl:text-2xl">
							Acesso Negado
						</DialogTitle>
						<DialogDescription className="text-center text-base xl:text-lg">
							Você precisa de um plano PREMIUM para gerar relatórios com IA.
						</DialogDescription>
					</DialogHeader>
				)}
				<Dialog
					open={showNoTransactionsDialog}
					onOpenChange={setShowNoTransactionsDialog}
				>
					<DialogContent className="max-w-[90vw] rounded-md p-4 md:max-w-[80vw] xl:max-w-[40vw]">
						<DialogHeader>
							<DialogTitle className="mt-6 text-center text-xl font-bold text-yellow-400 md:text-3xl xl:mt-0 xl:text-2xl">
								Não foi possível gerar o relatório.
							</DialogTitle>
							<DialogDescription className="text-center text-base md:text-xl xl:text-lg">
								<span className="block break-words">
									Nenhuma transação encontrada para o mês especificado.
								</span>
								<span className="block break-words">
									É necessário ao menos UMA transação para que seja possível a emissão do
									relatório.
								</span>
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
				<Dialog
					open={showPremiumRequiredDialog}
					onOpenChange={setShowPremiumRequiredDialog}
				>
					<DialogContent className="max-w-[90vw] rounded-md p-4 md:max-w-[80vw] xl:max-w-[40vw]">
						<DialogHeader>
							<DialogTitle className="mt-6 text-center text-xl font-bold text-yellow-400 md:text-3xl xl:mt-0 xl:text-2xl">
								Acesso Negado
							</DialogTitle>
							<DialogDescription className="text-center text-base md:text-xl xl:text-lg">
								<span className="block break-words">
									Você precisa de um plano PREMIUM para gerar relatórios com IA.
								</span>
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
				<Dialog
					open={showGenericErrorDialog}
					onOpenChange={setShowGenericErrorDialog}
				>
					<DialogContent className="max-w-[90vw] rounded-md p-4 md:max-w-[80vw] xl:max-w-[40vw]">
						<DialogHeader>
							<DialogTitle className="mt-6 text-center text-xl font-bold text-red-500 md:text-3xl xl:mt-0 xl:text-2xl">
								Ocorreu um Erro
							</DialogTitle>
							<DialogDescription className="text-center text-base md:text-xl xl:text-lg">
								<span className="block break-words">
									Não foi possível gerar o relatório devido a um erro inesperado.
								</span>
								<span className="block break-words">
									Por favor, tente novamente mais tarde.
								</span>
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</DialogContent>
		</Dialog>
	);
};

export default AiReportButton;
