"use client";

import { Card, CardHeader, CardContent } from "@/app/_components/ui/card";
import { CheckIcon, XIcon, Loader2Icon } from "lucide-react";
import dynamic from "next/dynamic";
import { Badge } from "@/app/_components/ui/badge";
import { useUser } from "@clerk/nextjs";

// dynamic loading for AcquirePlanButton
const AcquirePlanButton = dynamic(() => import("./acquire-plan-button"), {
	ssr: false,
	loading: () => (
		<button className="flex cursor-not-allowed items-center justify-center gap-2 rounded bg-white bg-opacity-15 px-4 py-2 text-white opacity-30">
			<Loader2Icon className="h-5 w-5 animate-spin text-white" />
			Carregando...
		</button>
	),
});

interface SubscriptionPlansProps {
	currentMonthTransactions: number;
	historyStartDate: string;
}

const SubscriptionPlans = ({
	currentMonthTransactions,
	historyStartDate,
}: SubscriptionPlansProps) => {
	const { user, isLoaded } = useUser();

	if (!isLoaded || !user) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="mb-[45vh] flex h-[5vh] w-[70vw] items-center justify-center gap-2 rounded-md border border-gray-400 bg-white bg-opacity-15 text-white opacity-30 md:w-[30vw] xl:w-[25vw]">
					<Loader2Icon className="h-8 w-8 animate-spin text-white" />
					Carregando planos...
				</div>
			</div>
		);
	}

	const userPlan =
		typeof user.publicMetadata.subscriptionPlan === "string"
			? user.publicMetadata.subscriptionPlan
			: null;

	const isPremiumMensal = userPlan === "premium-mensal";
	const isPremiumSemestral = userPlan === "premium-semestral";

	const historySince = historyStartDate;

	return (
		<div className="flex items-center justify-center px-4 pb-1 md:px-3 xl:px-6">
			<div className="flex w-full flex-col items-center justify-center gap-6 md:mb-2 md:flex-row md:gap-3 xl:gap-6">
				{/* Basic plan */}
				<Card className="group h-auto w-full max-w-[480px] shadow-md shadow-gray-800 transition duration-500 ease-in-out hover:-translate-y-[6px] hover:scale-[1.03] md:w-[33%]">
					<CardHeader className="md:duration-400 relative border-b border-solid bg-red-500 bg-opacity-[1.5%] py-4 transition-colors duration-500 group-hover:bg-opacity-[3%] group-active:bg-opacity-[3%] sm:py-6 md:py-8">
						<h2 className="text-center text-lg font-semibold sm:text-xl md:text-2xl">
							Plano Standard
							<br />
							<span>Básico</span>
						</h2>
						<div className="flex items-center justify-center gap-2 sm:gap-3">
							<span className="text-2xl font-bold sm:text-3xl md:text-4xl">R$</span>
							<span className="text-4xl font-semibold sm:text-5xl md:text-6xl">0</span>
							<span className="text-lg text-muted-foreground sm:text-xl md:text-2xl">
								/mês
							</span>
						</div>
					</CardHeader>
					<CardContent className="md:duration-400 space-y-4 bg-white bg-opacity-[0.8%] px-1 py-4 transition-colors duration-500 group-hover:!bg-muted/30 group-active:!bg-muted/30 sm:space-y-6 sm:py-6 md:space-y-[50px] md:px-1 md:py-8 xl:space-y-5 xl:px-4 xl:pt-6">
						<div className="flex items-center gap-2 sm:gap-3">
							<CheckIcon className="h-4 w-4 text-yellow-500 sm:h-5 sm:w-5" />
							<p className="text-sm sm:text-base md:text-xs">
								Transações: 12 por mês ({currentMonthTransactions}/12)
							</p>
						</div>

						<div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-1 xl:gap-3">
							<CheckIcon className="h-4 w-4 text-yellow-500 sm:h-5 sm:w-5" />
							{!isPremiumMensal && !isPremiumSemestral ? (
								<>
									<p className="text-sm sm:text-base md:hidden md:text-xs">
										Histórico de dados: 1 ano
									</p>
									<p className="hidden text-sm sm:text-base md:block md:text-xs">
										Histórico: 1 ano
									</p>
								</>
							) : (
								<p className="text-sm sm:text-base md:text-xs">
									Histórico de dados: 1 ano
								</p>
							)}
							{!isPremiumMensal && !isPremiumSemestral && (
								<p className="text-sm text-yellow-500 sm:text-sm md:text-xs">
									* Desde {historyStartDate} *
								</p>
							)}
						</div>
						<div className="flex items-center gap-2 sm:gap-3">
							<XIcon className="h-4 w-4 text-danger sm:h-5 sm:w-5" />
							<p className="text-sm sm:text-base md:text-xs">Relatórios de IA</p>
						</div>
						<div className="invisible flex items-center gap-2 sm:gap-3">
							<XIcon className="h-4 w-4 text-danger sm:h-5 sm:w-5" />
							<p className="text-sm sm:text-base">Relatórios de IA</p>
						</div>
						<div className="invisible mb-1 md:hidden xl:invisible xl:flex">
							<AcquirePlanButton planType="mensal" />
						</div>
					</CardContent>
				</Card>

				{/* Monthly Premium Plan */}
				<Card className="group h-auto w-full max-w-[480px] shadow-md shadow-gray-800 transition duration-500 ease-in-out hover:-translate-y-[6px] hover:scale-[1.03] md:w-[33%]">
					<CardHeader className="md:duration-400 relative border-b bg-yellow-500 bg-opacity-[1.5%] py-4 transition-colors duration-500 group-hover:bg-opacity-[3%] group-active:bg-opacity-[3%] sm:py-6 md:py-8">
						<h2 className="text-center text-lg font-semibold sm:text-xl md:text-2xl">
							Plano Premium <br />
							Mensal
						</h2>
						{isPremiumMensal && (
							<Badge className="absolute left-6 top-11 rounded-md bg-primary/20 text-xs text-primary hover:bg-white/20 sm:left-3 sm:top-8 sm:text-sm md:left-4 md:top-2 md:px-[1px] md:py-[.5px] md:text-xs xl:left-8 xl:top-12 xl:text-base">
								Plano Ativo
							</Badge>
						)}
						<div className="flex items-center justify-center gap-2 sm:gap-3">
							<span className="text-2xl font-bold sm:text-3xl md:text-4xl">R$</span>
							<span className="text-4xl font-semibold sm:text-5xl md:text-6xl">
								18
							</span>
							<span className="text-lg text-muted-foreground sm:text-xl md:text-2xl">
								/mês
							</span>
						</div>
					</CardHeader>
					<CardContent className="md:duration-400 space-y-4 bg-white bg-opacity-[0.8%] px-1 py-4 transition-colors duration-500 group-hover:!bg-muted/30 group-active:!bg-muted/30 sm:space-y-6 sm:py-6 md:space-y-6 md:px-1 md:py-8 xl:space-y-5 xl:px-4 xl:pt-6">
						<div className="flex items-center gap-2 sm:gap-3">
							<CheckIcon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
							<p className="text-sm sm:text-base md:text-xs">Transações: Ilimitadas</p>
						</div>

						<div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-1 xl:gap-3">
							<CheckIcon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
							{isPremiumMensal ? (
								<>
									<p className="text-sm sm:text-base md:hidden md:text-xs">
										Histórico de dados: Ilimitado
									</p>
									<p className="hidden text-sm sm:text-base md:block md:text-xs">
										Histórico: Ilimitado
									</p>
								</>
							) : (
								<p className="text-sm sm:text-base md:text-xs">
									Histórico de dados: Ilimitado
								</p>
							)}
							{isPremiumMensal && (
								<p className="text-xs text-yellow-500 sm:text-sm md:text-xs">
									*Desde {historySince}*
								</p>
							)}
						</div>
						<div className="flex items-center gap-2 sm:gap-3">
							<CheckIcon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
							<p className="text-sm sm:text-base md:text-xs">
								Relatórios Avançados de IA
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-2 sm:gap-3">
							<CheckIcon className="h-4 w-4 text-yellow-500 sm:h-5 sm:w-5" />
							<p className="text-sm sm:text-base md:text-xs xl:hidden xl:text-base">
								Renova mensal
								<br className="hidden md:inline xl:hidden" />
								&nbsp;&nbsp;
								<span className="invisible text-xs text-primary md:text-xs xl:text-sm">
									* Bom custo benefício *
								</span>
							</p>
							<p className="hidden text-sm sm:text-base md:text-xs xl:block xl:text-xs">
								Renovação mensal
								<br className="hidden md:inline xl:hidden" />
								&nbsp;&nbsp;
								<span className="invisible text-xs text-primary md:text-xs xl:text-sm">
									* Bom custo benefício *
								</span>
							</p>
						</div>
						<AcquirePlanButton planType="mensal" />
					</CardContent>
				</Card>

				{/* Semi-Annual Premium Plan */}
				<Card className="group h-auto w-full max-w-[480px] shadow-md shadow-gray-800 transition duration-500 ease-in-out hover:-translate-y-[6px] hover:scale-[1.03] md:w-[33%]">
					<CardHeader className="md:duration-400 relative border-b bg-green-500 bg-opacity-[1.5%] py-4 transition-colors duration-500 group-hover:bg-opacity-[3%] group-active:bg-opacity-[3%] sm:py-6 md:py-8">
						<h2 className="text-center text-lg font-semibold sm:text-xl md:text-2xl">
							Plano Premium <br />
							Semestral
						</h2>
						{isPremiumSemestral && (
							<Badge className="absolute left-6 top-11 rounded-md bg-primary/20 text-xs text-primary hover:bg-white/20 sm:left-3 sm:top-8 sm:text-sm md:left-4 md:top-2 md:px-[1px] md:py-[.5px] md:text-xs xl:left-8 xl:top-12 xl:text-base">
								Plano Ativo
							</Badge>
						)}
						<div className="flex items-center justify-center gap-2 sm:gap-3">
							<span className="text-2xl font-bold sm:text-3xl md:text-4xl">R$</span>
							<span className="text-4xl font-semibold sm:text-5xl md:text-6xl">
								85
							</span>
							<span className="text-lg text-muted-foreground sm:text-xl md:text-2xl">
								/semestre
							</span>
						</div>
					</CardHeader>
					<CardContent className="md:duration-400 space-y-4 bg-white bg-opacity-[0.8%] px-1 py-4 transition-colors duration-500 group-hover:!bg-muted/30 group-active:!bg-muted/30 sm:space-y-6 sm:py-6 md:space-y-6 md:px-1 md:py-8 xl:space-y-5 xl:px-4 xl:pt-6">
						<div className="flex items-center gap-2 sm:gap-3">
							<CheckIcon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
							<p className="text-sm sm:text-base md:text-xs">Transações: Ilimitadas</p>
						</div>
						<div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-1 xl:gap-3">
							<CheckIcon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
							{isPremiumSemestral ? (
								<>
									<p className="text-sm sm:text-base md:hidden md:text-xs">
										Histórico de dados: Ilimitado
									</p>
									<p className="hidden text-sm sm:text-base md:block md:text-xs">
										Histórico: Ilimitado
									</p>
								</>
							) : (
								<p className="text-sm sm:text-base md:text-xs">
									Histórico de dados: Ilimitado
								</p>
							)}
							{isPremiumSemestral && (
								<p className="text-xs text-yellow-500 sm:text-sm md:text-xs">
									*Desde {historySince}*
								</p>
							)}
						</div>
						<div className="flex items-center gap-2 sm:gap-3">
							<CheckIcon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
							<p className="text-sm sm:text-base md:text-xs">
								Relatórios Avançados de IA
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-2 sm:gap-3">
							<CheckIcon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
							<p className="text-sm sm:text-base md:text-xs xl:hidden xl:text-base">
								Renova cada 6 meses
								<br className="hidden md:inline xl:hidden" />
								&nbsp;&nbsp;
								<span className="text-xs text-primary md:text-xs xl:text-sm">
									* O Melhor custo benefício *
								</span>
							</p>
							<p className="hidden text-sm sm:text-base md:text-xs xl:block xl:text-xs">
								Renovação a cada 6 meses
								<br className="hidden md:inline xl:hidden" />
								&nbsp;&nbsp;
								<span className="text-xs text-primary md:text-xs xl:text-sm">
									* O Melhor custo benefício *
								</span>
							</p>
						</div>
						<AcquirePlanButton planType="semestral" />
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default SubscriptionPlans;
