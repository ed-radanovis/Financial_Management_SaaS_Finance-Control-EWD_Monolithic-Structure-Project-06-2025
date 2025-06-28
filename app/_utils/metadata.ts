import { Metadata } from "next";

export function generatePageMetadata(pageTitle: string): Metadata {
	const baseTitle = "Finance Control EWD";
	const fullTitle = `${baseTitle} - ${pageTitle}`;
	const description = `Controle de finanças - ${pageTitle}`;

	return {
		title: fullTitle,
		description: description,
		icons: {
			icon: "/favicon.ico",
		},
	};
}
