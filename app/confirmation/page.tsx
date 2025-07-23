import { Button } from "@/app/_components/ui/button";
import Image from "next/image";

export default function ConfirmationPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 xl:p-6">
			<div className="w-full max-w-md rounded-lg border bg-white bg-opacity-3 p-6 text-center shadow-md shadow-gray-500">
				<Image
					src="/logo finance control EWD quadrado.png"
					width={108}
					height={54}
					className="mx-auto mb-4 h-[45px] w-[90px] rounded-xl border-2 border-yellow-600 md:h-[60px] md:w-[120px]"
					alt="Finance Control EWD"
				/>
				<h1 className="mb-4 text-2xl font-bold text-primary opacity-80 md:text-3xl xl:text-3xl">
					Pagamento confirmado!
				</h1>
				<p className="mb-2 text-gray-300">
					Obrigado por assinar o Finance Control EWD. Sua assinatura está ativa e
					agora você pode aproveitar todos os recursos premium.
				</p>
				<p className="mb-10 text-gray-400">
					Verifique seu e-mail para mais detalhes.
				</p>
				<Button className="custom-active-transition w-full transform rounded-s-lg bg-primary/80 text-sm font-bold transition-colors duration-500 ease-in-out hover:bg-primary/60 hover:text-white/60 active:scale-95 active:opacity-60">
					<a href="/" className="block h-full w-full">
						Go to Dashboard
					</a>
				</Button>
			</div>
		</div>
	);
}
