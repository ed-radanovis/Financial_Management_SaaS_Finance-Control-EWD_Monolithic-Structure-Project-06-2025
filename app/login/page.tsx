import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { generatePageMetadata } from "../_utils/metadata";

// dynamically changes browser tab title
export const generateMetadata = () => generatePageMetadata("Login");

const LoginPage = async () => {
	const { userId } = await auth();
	if (userId) {
		redirect("/");
	}
	return (
		<div className="flex min-h-screen flex-col lg:grid lg:grid-cols-2">
			{/* left side of the page */}
			<div className="flex flex-1 flex-col items-center justify-center p-4 pt-0 lg:p-12">
				<div className="mb-1 flex flex-col items-center md:mt-[-2%] lg:mb-8 lg:flex-row lg:gap-2">
					<Image
						src="/logo_login.png"
						width={400}
						height={240}
						alt="Finance Control EWD"
						className="h-auto w-[40%] md:w-[50%] lg:w-[30%]"
					/>
					<h1
						className="mt-0 bg-clip-text text-center text-xl text-transparent md:text-3xl lg:text-3xl"
						style={{
							background:
								"linear-gradient(164deg, #7e5629 0%, #725f36 25%, #a99d84 50%, #cdbf82 75%, #eec60f 100%)",
							WebkitBackgroundClip: "text",
						}}
					>
						Finance Control EWD
					</h1>
				</div>

				<h2 className="mb-4 text-center text-2xl font-bold md:text-3xl lg:mb-8 lg:text-left lg:text-3xl">
					Bem-vindo!
				</h2>
				<p className="mb-6 text-center text-sm text-muted-foreground md:text-lg lg:mb-20 lg:text-left lg:text-lg">
					Finance Control EWD é uma plataforma exclusiva de gestão financeira
					inteligente, desenvolvida para quem valoriza excelência, segurança e
					controle absoluto. Com o poder da Inteligência Artificial, transforma cada
					movimentação em insights personalizados e precisos, proporcionando uma
					experiência sofisticada de domínio financeiro. Mais do que um sistema — uma
					jornada rumo à tranquilidade e ao prestígio de uma vida financeira bem
					conduzida.
				</p>
				<SignInButton>
					<Button
						variant="outline"
						className="custom-active-transition shadow-md shadow-gray-800 transition-all duration-500 ease-in-out hover:shadow-gray-500 active:scale-95 active:bg-primary"
					>
						<LogInIcon className="mr-2" />
						Fazer login ou criar conta
					</Button>
				</SignInButton>
			</div>

			{/* right side of the page */}
			<div className="relative h-[47vh] w-full lg:h-full">
				<Image
					src="/page-login_finance_control_EWD.jpg"
					alt="Faça login"
					fill
					className="object-fill object-center"
					priority
				/>
			</div>
		</div>
	);
};

export default LoginPage;
