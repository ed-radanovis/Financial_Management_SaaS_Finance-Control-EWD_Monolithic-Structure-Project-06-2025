import { Button } from "@/app/_components/ui/button";
import Image from "next/image";

export default function CancellationPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4 xl:p-6">
			<div className="w-full max-w-md rounded-lg border bg-white bg-opacity-3 p-6 text-center shadow-md shadow-yellow-500">
				<Image
					src="/logo finance control EWD quadrado.png"
					width={108}
					height={54}
					className="mx-auto mb-4 h-[45px] w-[90px] rounded-xl border-2 border-yellow-600 md:h-[60px] md:w-[120px]"
					alt="Finance Control EWD"
				/>
				<h1 className="mb-4 text-2xl font-bold text-danger md:text-3xl xl:text-3xl">
					Pagamento Cancelado
				</h1>
				<p className="mb-2 text-justify text-gray-300">
					Lamentamos o cancelamento. Se mudar de ideia, temos uma oferta especial:
					experimente 7 dias grátis com 10% de desconto na sua próxima assinatura!
				</p>
				<p className="mb-10 text-gray-400">
					Entre em contato conosco para mais informações.
				</p>
				<Button className="custom-active-transition transform rounded-s-lg bg-yellow-400 text-sm font-bold text-gray-800 transition-colors duration-500 ease-in-out hover:bg-yellow-400/60 hover:text-gray-300 active:scale-95 active:opacity-60">
					<a href="/subscription" className="block h-full w-full">
						Tente Novamente
					</a>
				</Button>
				<p className="mt-4 text-sm text-gray-500">
					Support:{" "}
					<a href="mailto:edradanovis@gmail.com" className="underline">
						edradanovis@gmail.com
					</a>
				</p>
			</div>
		</div>
	);
}
