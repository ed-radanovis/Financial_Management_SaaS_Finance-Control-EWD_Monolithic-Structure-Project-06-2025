import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import { clerkClient } from "@clerk/nextjs/server";
import clsx from "clsx";

interface FooterProps {
	className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
	const totalUsers = clerkClient().users.getCount() || 0;

	return (
		<footer
			className={clsx(
				"mx-2 flex h-auto flex-col items-center justify-between gap-1 rounded-tl-md rounded-tr-md border bg-gray-400 bg-opacity-5 px-4 pb-4 pt-2 text-white shadow-md shadow-gray-800 md:mx-2 md:h-12 md:flex-row md:gap-4 md:px-0 md:pb-8 md:pt-10 xl:mx-6 xl:gap-0",
				className,
			)}
		>
			<div className="flex flex-col items-center md:ml-5 md:flex-row md:gap-4">
				<Image
					src="/logo_EWD_apex.png"
					alt="Logo da Empresa"
					width={60}
					height={60}
					className="opacity-70 transition-all duration-500 ease-in-out hover:-translate-y-[3px] hover:translate-x-[3px] hover:scale-[1.10] hover:opacity-100 md:h-[50px] md:w-[50px] xl:h-[70px] xl:w-[70px]"
				/>
				<a
					href="https://edwebdev.vercel.app/"
					target="_blank"
					rel="noopener noreferrer"
					className="custom-active-transition font-bold opacity-30 transition-all duration-500 ease-in-out hover:scale-[1.02] hover:opacity-60 active:scale-110 md:text-xs xl:text-sm"
				>
					Desenvolvido por EWD APEX - &copy; {new Date().getFullYear()}
				</a>
			</div>
			<div className="hidden rounded-md border border-solid border-white border-opacity-30 bg-green-500 bg-opacity-[1.5%] px-4 md:flex md:items-center md:justify-center">
				<span className="text-xs font-normal opacity-65">
					Total de usuários ativos do app:
				</span>
				<span className="ml-2 text-base font-semibold text-primary md:ml-2 md:text-lg">
					{totalUsers}
				</span>
			</div>
			<div className="flex flex-col items-center md:mr-5 md:flex-row md:gap-6">
				<a
					href="https://wa.me/5535984256707"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2 md:gap-3"
				>
					<MessageCircle className="custom-active-transition h-4 w-4 text-green-500 transition-all duration-500 ease-in-out hover:-translate-y-[2px] hover:translate-x-[2px] hover:scale-[1.2] hover:opacity-60 active:scale-95 active:text-green-300 md:h-5 md:w-5" />
					<span className="custom-active-transition text-sm font-bold opacity-30 transition-opacity duration-500 ease-in-out hover:opacity-60 active:scale-110 active:text-green-400">
						(35) 9 8425-6707
					</span>
				</a>
				<a
					href="mailto:edradanovis@gmail.com?subject=Suporte%20ao%20cliente&body=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20o%20seu%20produto."
					className="flex items-center gap-2 md:gap-3"
				>
					<Mail className="custom-active-transition h-4 w-4 text-blue-600 transition-all duration-500 ease-in-out hover:-translate-y-[2px] hover:translate-x-[2px] hover:scale-[1.2] hover:opacity-60 active:scale-95 active:text-blue-400 md:h-5 md:w-5" />
					<span className="custom-active-transition text-sm font-bold opacity-30 transition-opacity duration-500 ease-in-out hover:opacity-60 active:scale-110 active:text-blue-500">
						edradanovis@gmail.com
					</span>
				</a>
			</div>
		</footer>
	);
};

export default Footer;
